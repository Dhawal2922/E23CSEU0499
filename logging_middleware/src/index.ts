export type Stack = "backend" | "frontend";
export type Level = "debug" | "info" | "warn" | "error" | "fatal";

export type BackendPackage = 
  | "cache" | "controller" | "cron_job" | "db" 
  | "domain" | "handler" | "repository" | "route" | "service";

export type FrontendPackage = 
  | "api" | "component" | "hook" | "page" | "state" | "style";

export type SharedPackage = 
  | "auth" | "config" | "middleware" | "utils";

export type ValidPackage<S extends Stack> = 
  S extends "backend" ? BackendPackage | SharedPackage :
  S extends "frontend" ? FrontendPackage | SharedPackage : never;

let configToken: string | undefined;

/**
 * Initialize the logger configuration (e.g., token for protected API).
 */
export function initLogger(config: { token?: string }) {
  if (config.token) {
    configToken = config.token;
  }
}

/**
 * Log function matching the requested structure.
 * It strictly enforces the correct package type based on the stack.
 */
export async function Log<S extends Stack>(
  stack: S,
  level: Level,
  pkg: ValidPackage<S>,
  message: string
) {
  const payload = {
    stack,
    level,
    package: pkg,
    message
  };

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (configToken) {
      headers["Authorization"] = `Bearer ${configToken}`;
    }

    const response = await fetch("http://4.224.186.213/evaluation-service/logs", {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn(`Logging failed with status ${response.status}`);
      const text = await response.text();
      console.warn(`Response: ${text}`);
    }
  } catch (error) {
    console.error("Failed to execute log API call:", error);
  }
}
