require("dotenv").config();
const { startServer } = require("./src");

startServer().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
