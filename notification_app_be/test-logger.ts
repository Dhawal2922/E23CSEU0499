import { Log, initLogger } from 'logger-middleware';

// Note: No token was explicitly mentioned in the prompt, so testing with an empty token or dummy token.
initLogger({ token: "test-token" });

async function testLogger() {
  console.log("Testing logger middleware...");
  await Log("backend", "error", "handler", "received string, expected bool");
  console.log("Logger test complete.");
}

testLogger();
