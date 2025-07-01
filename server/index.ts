import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Proxy middleware for backend API at localhost:8000
  app.use("/api", async (req, res) => {
    try {
      const backendUrl = `http://localhost:8000${req.path}`;

      // Forward the request to the Python backend
      const response = await fetch(backendUrl, {
        method: req.method,
        headers: {
          "Content-Type": "application/json",
          // Forward authorization header if present
          ...(req.headers.authorization && {
            Authorization: req.headers.authorization,
          }),
        },
        // Forward request body for POST/PUT/PATCH requests
        ...(req.body &&
          Object.keys(req.body).length > 0 && {
            body: JSON.stringify(req.body),
          }),
      });

      const data = await response.json();

      // Forward the response status and data
      res.status(response.status).json(data);
    } catch (error) {
      console.error("Proxy error:", error);
      res.status(500).json({
        error: "Backend service unavailable",
        message: "Could not connect to API backend at localhost:8000",
      });
    }
  });

  // Keep example routes for testing
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  return app;
}
