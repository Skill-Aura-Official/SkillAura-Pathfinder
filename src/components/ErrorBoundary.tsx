import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface State { hasError: boolean; error: Error | null; }

export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error("[ErrorBoundary]", error, info);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="surface-card-inset p-8 max-w-md text-center">
          <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-3" />
          <h2 className="text-lg font-bold text-foreground mb-2">[SYSTEM ERROR]</h2>
          <p className="text-sm text-muted-foreground mb-4 font-mono">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={this.reset} size="sm" variant="outline">Retry</Button>
            <Button onClick={() => (window.location.href = "/")} size="sm" className="gradient-primary text-foreground border-0">
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
