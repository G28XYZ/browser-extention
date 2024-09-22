import "reflect-metadata";

import ReactDOM from "react-dom/client";
import { App } from "@/app.tsx";
import "@/styles/index.css";
import { StoreProvider } from "./store";
import { Loading } from "./components/Loading";
import { ChangeTheme } from "./components/ChangeTheme";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<StoreProvider>
		<ChangeTheme />
		<App />
	</StoreProvider>
);
