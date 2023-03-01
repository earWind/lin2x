import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.svg";
import "./index.css";

import Counter from "../../components/Counter";

function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount((count) => count - 1);
  };

  useEffect(() => {
    setFlag(flag + 1);
    console.log(flag);
  }, [count]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button onClick={increment}>increment</button>
          <span>count is: {count}</span>
          <button onClick={decrement}>decrement</button>
        </p>
        <p>
          Edit <code>App.jsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {" | "}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>

        <Counter />
        <Counter />
      </header>
    </div>
  );
}

export default App;
