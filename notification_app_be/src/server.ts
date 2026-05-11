import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import { Log, initLogger } from 'logger-middleware';

// Initialize logger
initLogger({ token: process.env.LOG_TOKEN || 'test-token-123' });

const app = express();
const PORT = 3000;

app.use(express.json());

// Example Middleware using the logger
app.use((req: Request, res: Response, next: NextFunction) => {
  Log("backend", "info", "middleware", `Incoming request: ${req.method} ${req.url}`);
  next();
});

// Example Route using the logger
app.get('/api/health', (req: Request, res: Response) => {
  Log("backend", "debug", "route", "Health check endpoint called");
  res.json({ status: "ok" });
});

// Example Controller logic using the logger
app.post('/api/data', (req: Request, res: Response) => {
  const { data } = req.body;
  if (!data) {
    Log("backend", "warn", "controller", "Received POST without data");
    return res.status(400).json({ error: "No data provided" });
  }

  Log("backend", "info", "controller", `Received valid data: ${JSON.stringify(data)}`);
  res.json({ status: "success", data });
});

// Example Service error simulation
app.get('/api/error', (req: Request, res: Response) => {
  Log("backend", "error", "service", "Simulated service failure");
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  Log("backend", "info", "config", `Server is running on port ${PORT}`);
  console.log(`Backend listening on port ${PORT}`);
});
