import { StrictMode } from "react";
import AppLink from "../lib/AppLink";
import Footer from "../lib/Footer";

function Acknowledgment() {
  return (
    <StrictMode>
      <div>
        <article className="prose prose-invert prose-lg py-8 pb-12">
          <AppLink to="/home">Back Home</AppLink>
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
        </article>
        <Footer />
      </div>
    </StrictMode>
  );
}

export default Acknowledgment;
