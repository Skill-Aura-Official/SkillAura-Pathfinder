import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { supabaseConfig } from "./integrations/supabase/config";
import "./index.css";

const App = lazy(() => import("./App"));

createRoot(document.getElementById("root")!).render(
  supabaseConfig ? (
    <Suspense fallback={<main aria-busy="true" className="p-6">Loading Pathfinder…</main>}>
      <App />
    </Suspense>
  ) : (
    <main className="p-6">
      <h1 className="text-xl font-semibold">Pathfinder setup required</h1>
      <p>Configure the Supabase project URL and publishable key before starting the app.</p>
    </main>
  ),
);
