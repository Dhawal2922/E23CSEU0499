import { useState, useEffect } from 'react'
import { Log, initLogger } from 'logger-middleware'
import './App.css'

// Initialize the logger for frontend usage
initLogger({ token: 'frontend-token-456' });

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    Log('frontend', 'info', 'component', 'App component mounted');
  }, []);

  const handleClick = () => {
    setCount((count) => count + 1);
    Log('frontend', 'debug', 'state', `Count updated to ${count + 1}`);
  };

  const simulateApiCall = async () => {
    Log('frontend', 'info', 'api', 'Starting simulated API call');
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 500));
      throw new Error("Simulated network failure");
    } catch (err: any) {
      Log('frontend', 'error', 'api', `API call failed: ${err.message}`);
    }
  };

  return (
    <div className="App">
      <h1>Logging Middleware Demo</h1>
      <div className="card">
        <button onClick={handleClick}>
          count is {count}
        </button>
        <button onClick={simulateApiCall} style={{ marginLeft: '10px' }}>
          Simulate API Error
        </button>
      </div>
      <p className="read-the-docs">
        Check the console and the backend test server for log events.
      </p>
    </div>
  )
}

export default App
