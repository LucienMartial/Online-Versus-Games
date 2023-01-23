import { StrictMode } from "react";
import { Link } from "react-router-dom";
import "./style.scss";

function Acknowledgement() {
  return (
    <StrictMode>
      <main>
        <h1>Acknowledgement</h1>
        <h2>Images</h2>
        <ul>
          <li></li>
        </ul>
        <h2>Sound</h2>
        <ul>
          <li></li>
        </ul>
        <h2>Libraries</h2>
        <ul>
          <li>Colyseus, @colyseus command</li>
          <li>
            PIXI.js, @pixi filters, @pixi assets, @pixi particles, @pixi
            viewport
          </li>
          <li>SAT.js</li>
          <li>Typescript</li>
          <li>React, React router</li>
          <li>Framer motion</li>
          <li>Vite, Vitest, Sass, Supertest, ts-node</li>
          <li>Express, @express cookie session</li>
          <li>bcrypt, Dotenv</li>
          <li>MongoDB</li>
        </ul>
        <Link to={"/"} className={"link"}>
          Back Home
        </Link>
      </main>
    </StrictMode>
  );
}

export default Acknowledgement;
