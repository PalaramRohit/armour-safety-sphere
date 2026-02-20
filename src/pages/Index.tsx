// Redirect to dashboard as the blank page is no longer used
import { Navigate } from "react-router-dom";
export default function Index() {
  return <Navigate to="/" replace />;
}
