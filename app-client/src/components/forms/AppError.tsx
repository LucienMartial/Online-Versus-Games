import {ReactNode, StrictMode} from "react";

interface AppLinkProps {
  children?: ReactNode;
}

export default function AppLink({children}: AppLinkProps) {
  return (
      <StrictMode>
        <p className={"text-red-500 font-bold"}>{children}</p>
      </StrictMode>
  )
}