import devServer from "@hono/vite-dev-server";
import path from "path";
import { copyFileSync } from "node:fs";
const __dirname = import.meta.dirname;
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { inspectAttr } from "kimi-plugin-inspect-react";

const entryName = "scroll_login_animation_v01.html";

export default defineConfig({
  plugins: [
    {
      name: "versioned-scroll-entry",
      configureServer(server) {
        server.middlewares.use((request, _response, next) => {
          const url = new URL(request.url || "/", "http://localhost");
          if (url.pathname === "/") request.url = `/${entryName}${url.search}`;
          next();
        });
      },
      closeBundle() {
        const output = path.resolve(__dirname, "dist/public");
        copyFileSync(path.join(output, entryName), path.join(output, "index.html"));
      },
    },
    devServer({ entry: "api/boot.ts", exclude: [/^\/(?!api\/).*$/] }),
    inspectAttr(),
    react(),
  ],
  server: { port: 3000 },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@contracts": path.resolve(__dirname, "./contracts"),
      "@db": path.resolve(__dirname, "./db"),
      db: path.resolve(__dirname, "./db"),
    },
  },
  envDir: path.resolve(__dirname),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: { input: path.resolve(__dirname, entryName) },
  },
});
