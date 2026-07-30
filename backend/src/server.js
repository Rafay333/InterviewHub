const { env } = require("./config/env");
const app = require("./app");

const server = app.listen(env.port, () => {
  console.log(`InterviewHub API listening on http://localhost:${env.port}`);
  console.log(`Health: http://localhost:${env.port}/api/health`);
});

server.on("error", (err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});
