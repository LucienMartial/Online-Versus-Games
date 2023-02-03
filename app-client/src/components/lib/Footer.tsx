import { StrictMode } from "react";
import AppLink from "./AppLink";
import returnURL from "../../types/returnURL";
import { FiGithub } from "react-icons/fi";

interface FooterProps {
  returnURL?: returnURL;
}

function Footer({ returnURL }: FooterProps) {
  return (
    <StrictMode>
      <footer className="w-full flex justify-center sm:justify-between px-8 py-5 flex-wrap gap-5">
        <span className="text-blue-200 whitespace-nowrap">2023 Versus Game</span>
        <ul className="flex items-center gap-5 flex-wrap justify-center sm:justify-between">
          <a title="See project on GitHub" href="https://github.com/LucienMartial/Online-Versus-Game">
            <FiGithub strokeWidth={2.5} className="text-blue-200" />
          </a>
          <li>
            <AppLink className={"text-blue-200"} to={"/privacy"} returnURL={returnURL}>Privacy Policy</AppLink>
          </li>
          <li>
            <AppLink className={"text-blue-200"} to={"/acknowledgment"} returnURL={returnURL}>Acknowledgment</AppLink>
          </li>
        </ul>
      </footer>
    </StrictMode>
  );
}

export default Footer;
