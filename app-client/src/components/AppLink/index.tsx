import { ReactNode, StrictMode } from "react";
import { Link } from "react-router-dom";

interface AppLinkProps {
  to: string;
  children?: ReactNode;
}

function AppLink({ to, children }: AppLinkProps) {
  return (
    <StrictMode>
      <Link to={to} className="text-indigo-300">
        {children}
      </Link>
    </StrictMode>
  );
}

export default AppLink;
