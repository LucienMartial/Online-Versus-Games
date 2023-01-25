import { ReactNode, StrictMode } from "react";
import { Link } from "react-router-dom";

interface AppLinkProps {
  to: string;
  children?: ReactNode;
}

function AppLink({ to, children }: AppLinkProps) {
  return (
    <StrictMode>
      <Link to={to} className="text-blue-400 decoration-0 font-bold cursor-pointer hover:text-blue-700">
        {children}
      </Link>
    </StrictMode>
  );
}

export default AppLink;
