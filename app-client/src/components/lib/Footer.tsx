import { StrictMode } from "react";
import AppLink from "./AppLink";
import { FiGithub } from "react-icons/fi";

function Footer() {
  return (
    <StrictMode>
      <footer className="w-full flex justify-center sm:justify-between px-8 py-5 flex-wrap gap-5">
        <span className="text-blue-200 whitespace-nowrap">2023 Versus Game</span>
        <ul className="flex items-center gap-5 flex-wrap justify-center sm:justify-between">
          <a title="See project on GitHub" href="https://github.com/LucienMartial/Online-Versus-Game">
            <FiGithub strokeWidth={2.5} className="text-blue-200" />
          </a>
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
