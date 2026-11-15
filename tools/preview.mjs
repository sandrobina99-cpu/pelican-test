import { startServer } from "./lib.mjs";

const server = await startServer();
const page = `${server.url}/public/index.html`;
console.log(page);
console.log("Leave this process running and open the URL. Ctrl-C to stop.");
process.on("SIGINT", async () => {
  await server.close();
  process.exit(0);
});
