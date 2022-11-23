import { useEffect, useState } from "react";
// import reactLogo from "./assets/react.svg";
import "./App.css";

import { basic } from "@shared/main";
import Game from "./game/Game";

console.log(basic());

function App() {
  const [started, setStarted] = useState(false);

  // for development
  // useEffect(() => {
  //   setStarted(true);
  // }, []);

  // game
  if (started) {
    return <Game></Game>;
  }

  // basic menu
  return (
    <div className="App">
      <h1>Online Game Menu</h1>
      <div className="card">
        <button onClick={() => setStarted(true)}>Play</button>
      </div>
    </div>
  );
}

export default App;
