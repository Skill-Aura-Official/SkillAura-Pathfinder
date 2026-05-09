import { Navigate } from "react-router-dom";

// Legacy route — redirect to landing
export default function Index() {
  return <Navigate to="/" replace />;
}
