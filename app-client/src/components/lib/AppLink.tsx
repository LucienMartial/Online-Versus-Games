import { ReactNode, StrictMode } from "react";
import { Link } from "react-router-dom";
import returnURL from "../../types/returnURL";

interface AppLinkProps {
  to: string;
  className?: string;
  returnURL?: returnURL;
  children?: ReactNode;
}

function AppLink({ to, className,returnURL, children }: AppLinkProps) {
  return (
    <StrictMode>
      <Link
        to={to}
        className={`${className?? ""} decoration-0 font-semibold cursor-pointer hover:text-blue-400 whitespace-nowrap`}
        state={returnURL}
      >
        {children}
      </Link>
    </StrictMode>
  );
}

export default AppLink;
