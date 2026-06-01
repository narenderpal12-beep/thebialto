import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setAuthTokenGetter } from "@workspace/api-client-react";

// Register the bearer token getter so every API request automatically
// includes Authorization: Bearer <token> when the admin is logged in.
setAuthTokenGetter(() => localStorage.getItem("bialto_admin_token"));

createRoot(document.getElementById("root")!).render(<App />);
