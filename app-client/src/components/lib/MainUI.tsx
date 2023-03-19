import { ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

interface MainUIProps {
  tryLogout: () => Promise<void>;
  children: ReactNode;
}

export default function MainUI({ tryLogout, children }: MainUIProps) {
  // const settingContext = useContext(UserSettingsContext);

  function playMusic(): null {
    // if (settingContext.musicEnabled) {
    //   const audio = new Audio(menuMusic);
    //   audio.loop = true;
    //   audio.play();
    // }

    return null;
  }

  return (
    <div className="flex flex-col w-screen min-h-screen justify-between">
      {playMusic()}
      <Navbar tryLogout={tryLogout} />
      {children}
      <Footer />
    </div>
  );
}
