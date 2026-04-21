import { createRoot } from "react-dom/client";
import App from "./App";
// Self-host Cairo so it loads reliably on every device (esp. mobile networks
// where Google Fonts can be slow or blocked).
import "@fontsource/cairo/300.css";
import "@fontsource/cairo/400.css";
import "@fontsource/cairo/500.css";
import "@fontsource/cairo/600.css";
import "@fontsource/cairo/700.css";
import "@fontsource/cairo/800.css";
import "@fontsource/cairo/arabic-300.css";
import "@fontsource/cairo/arabic-400.css";
import "@fontsource/cairo/arabic-500.css";
import "@fontsource/cairo/arabic-600.css";
import "@fontsource/cairo/arabic-700.css";
import "@fontsource/cairo/arabic-800.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
