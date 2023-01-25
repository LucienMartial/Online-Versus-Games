import { StrictMode } from "react";
import AppLink from "../AppLink";

function Footer() {
  return (
    <StrictMode>
      <footer className="flex justify-between p-4 bg-blue-900">
        <span>2023 Versus Game</span>
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
