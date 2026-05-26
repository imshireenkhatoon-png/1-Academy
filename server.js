const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const leadRoutes = require("./routes/leadRoutes");

dotenv.config();

const app = express();
const BASE_PORT = Number.parseInt(process.env.PORT, 10) || 3000;
const MAX_PORT_RETRIES = 10;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/leads", leadRoutes);
app.use("/submit", leadRoutes);
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "1PERCENTACADEMY",
    timestamp: new Date().toISOString()
  });
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

function startServer(port, attempt = 0) {
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && attempt < MAX_PORT_RETRIES) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is in use. Trying ${nextPort}...`);
      startServer(nextPort, attempt + 1);
      return;
    }

    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  });
}

startServer(BASE_PORT);
