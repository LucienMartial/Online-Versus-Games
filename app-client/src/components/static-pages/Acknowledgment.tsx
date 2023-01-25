import { StrictMode } from "react";
import StaticPage from "./StaticPage";

function Acknowledgment() {
  return (
    <StrictMode>
      <StaticPage>
        <h1>Acknowledgement</h1>
        <h2>Images</h2>
        <ul>
          <li></li>
        </ul>
        <h2>Sound</h2>
        <ul>
          <li></li>
        </ul>
        <h2>Main Techstack</h2>
        <ul>
          <li>Colyseus</li>
          <li>PIXI.js</li>
          <li>React, Tailwind</li>
          <li>MongoDB</li>
        </ul>
      </StaticPage>
    </StrictMode>
  );
}

export default Acknowledgment;
