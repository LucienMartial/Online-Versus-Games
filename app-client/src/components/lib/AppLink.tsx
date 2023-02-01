import { ReactNode, StrictMode } from "react";
import { Link } from "react-router-dom";

interface AppLinkProps {
  to: string;
  className?: string;
  children?: ReactNode;
}

function AppLink({ to, className,children }: AppLinkProps) {
  return (
    <StrictMode>
      <Link
        to={to}
        className={`${className?? ""} decoration-0 font-semibold cursor-pointer hover:text-blue-400 whitespace-nowrap`}
      >
        {children}
      </Link>
    </StrictMode>
  );
}

export default AppLink;
