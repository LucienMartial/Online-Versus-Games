import { StrictMode } from "react";
import AppLink from "./AppLink";

function Footer() {
  return (
    <StrictMode>
      <footer className="flex justify-between px-8 py-5">
        <span className="text-blue-200">2023 Versus Game</span>
        <ul className="flex gap-5">
          <li>
            <AppLink to={"/privacy"}>Privacy Policy</AppLink>
          </li>
          <li>
            <AppLink to={"/acknowledgment"}>Acknowledgment</AppLink>
          </li>
        </ul>
      </footer>
    </StrictMode>
  );
}

export default Footer;
