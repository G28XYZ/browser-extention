import { defineConfig, UserConfigFnObject } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

type TConfig = ReturnType<UserConfigFnObject>;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const config: TConfig = {
		plugins: [react()],
		resolve: {
			alias: {
				"@": resolve(__dirname, "src"),
			},
		},
		build: {
			// emptyOutDir: false,
			sourcemap: mode !== "production",
		},
	};

	const input = {
		app: resolve(__dirname, "index.html"),
		background: resolve(__dirname, `src`, "scripts", "service-worker", "background.ts"),
		content: resolve(__dirname, `src`, "scripts", "injection", "content.ts"),
	};

	const entryFileNames = (chunk: { name: string }) => {
		switch (chunk.name) {
			case "app":
			case "background":
			case "content":
				return `${chunk.name}.js`;
		}
		return "[name].js";
	};

	config.build!.rollupOptions = {
		input,
		output: {
			dir: "build",
			entryFileNames,
		},
	};

	return config;
});
