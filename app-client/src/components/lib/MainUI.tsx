import { ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

interface MainUIProps {
  tryLogout: () => Promise<void>;
  children: ReactNode;
}

export default function MainUI({ tryLogout, children }: MainUIProps) {
  return (
    <div className="flex flex-col w-screen min-h-screen justify-between">
      <Navbar tryLogout={tryLogout} />
      {children}
      <Footer />
    </div>
  );
}
