import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const projectDir = fileURLToPath(
  new URL("./scroll-login-animation-v01/", import.meta.url),
);
const viteBin = fileURLToPath(
  new URL(
    "./scroll-login-animation-v01/node_modules/vite/bin/vite.js",
    import.meta.url,
  ),
);
const portArgument = process.argv
  .slice(2)
  .findLast((argument) => /^\d+$/.test(argument));
const configuredPort =
  process.env.npm_config_port && process.env.npm_config_port !== "true"
    ? process.env.npm_config_port
    : undefined;
const port = portArgument || configuredPort || process.env.PORT || "3000";

const child = spawn(
  process.execPath,
  [viteBin, "--host", "0.0.0.0", "--port", port, "--strictPort"],
  { cwd: projectDir, stdio: "inherit" },
);

process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
child.on("exit", (code) => process.exit(code ?? 0));
