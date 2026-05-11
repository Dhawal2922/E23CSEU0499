const { Log, initLogger } = require('./dist/index.js');

// If you have a valid token for the API, add it here!
initLogger({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJlMjNjc2V1MDQ5OUBiZW5uZXR0LmVkdS5pbiIsImV4cCI6MTc3ODQ4NDY3MCwiaWF0IjoxNzc4NDgzNzcwLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMzgyNmE4ODctZWExZi00NmVmLWI4ZWMtMWVlMzFiNjE1MGYzIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiZGhhd2FsIGphaW4iLCJzdWIiOiI3ZmZiMzQ0Mi1hZjIwLTQ3OGYtYTg4Mi1lNWU1ZDJkMTQxODYifSwiZW1haWwiOiJlMjNjc2V1MDQ5OUBiZW5uZXR0LmVkdS5pbiIsIm5hbWUiOiJkaGF3YWwgamFpbiIsInJvbGxObyI6ImUyM2NzZXUwNDk5IiwiYWNjZXNzQ29kZSI6IlRmRHhnciIsImNsaWVudElEIjoiN2ZmYjM0NDItYWYyMC00NzhmLWE4ODItZTVlNWQyZDE0MTg2IiwiY2xpZW50U2VjcmV0IjoiSnlVQnRYclBrZmhwTVRQSiJ9.FI8J1j57UwNKfkvyNUinRcnj5ye9AfBPMYBFgwWbdzI' });

async function runTest() {
  console.log("Sending test log to the API...");
  
  // Example 1: Valid backend log
  await Log("backend", "info", "controller", "Testing the logger package from a Node script!");
  
  // Example 2: Valid frontend log
  await Log("frontend", "error", "component", "Simulated frontend component error");
  
  console.log("Log requests completed. Check the console output above for any API responses (like 401 Unauthorized if the token is invalid).");
}

runTest();
