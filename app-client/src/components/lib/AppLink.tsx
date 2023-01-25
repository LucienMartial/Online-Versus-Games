import { ReactNode, StrictMode } from "react";
import { Link } from "react-router-dom";

interface AppLinkProps {
  to: string;
  children?: ReactNode;
}

function AppLink({ to, children }: AppLinkProps) {
  return (
    <StrictMode>
      <Link
        to={to}
        className="text-blue-300 decoration-0 font-semibold cursor-pointer hover:text-blue-400"
      >
        {children}
      </Link>
    </StrictMode>
  );
}

export default AppLink;
