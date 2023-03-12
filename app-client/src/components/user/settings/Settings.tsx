import { useContext, useEffect, useState } from "react";
import switchAudio from "/assets/sounds/click-button.mp3";
import AppButton from "../../lib/AppButton";
import { UserSettingsContext, UserSettingsContextType } from "../../../App";
import { AiOutlineSound } from "react-icons/ai";
import { BsMusicNoteBeamed } from "react-icons/bs";

export default function Settings() {
  const settingContext = useContext(UserSettingsContext);
  const [userSettings, setUserSettings] = useState<UserSettingsContextType>({
    soundEnabled: settingContext.soundEnabled,
    musicEnabled: settingContext.musicEnabled,
  });
  const switchAudioEnable = new Audio(switchAudio);

  useEffect(() => {
    const userSettingsString = localStorage.getItem("user-settings");
    if (userSettingsString) {
      const userSettings: UserSettingsContextType =
        JSON.parse(userSettingsString);
      settingContext.soundEnabled = userSettings.soundEnabled;
      settingContext.musicEnabled = userSettings.musicEnabled;
      setUserSettings(userSettings);
    }
  }, []);

  function toggleSound() {
    setUserSettings({
      ...userSettings,
      soundEnabled: !userSettings.soundEnabled,
    });
    localStorage.setItem(
      "user-settings",
      JSON.stringify({
        ...userSettings,
        soundEnabled: !userSettings.soundEnabled,
      }),
    );
    settingContext.soundEnabled = !settingContext.soundEnabled;
    if (settingContext.soundEnabled) {
      switchAudioEnable.play();
    }
  }

  function toggleMusic() {
    setUserSettings({
      ...userSettings,
      musicEnabled: !userSettings.musicEnabled,
    });
    localStorage.setItem(
      "user-settings",
      JSON.stringify({
        ...userSettings,
        musicEnabled: !userSettings.musicEnabled,
      }),
    );
    settingContext.musicEnabled = !settingContext.musicEnabled;
    if (userSettings.soundEnabled) {
      switchAudioEnable.play();
    }
  }

  return (
    <div className={"h-full w-full"}>
      <h1 className={"text-clip text-4xl font-semibold m-2"}>Settings</h1>
      <div className={"flex justify-start"}>
        <div className={"border-4 m-4 rounded-md"}>
          {userSettings.soundEnabled ? (
            <AppButton
              onClick={toggleSound}
              color={"regular"}
              className={"p-4"}
            >
              Disable Sound
            </AppButton>
          ) : (
            <AppButton
              onClick={toggleSound}
              color={"regular"}
              className={"p-4"}
            >
              Enable Sound <AiOutlineSound />
            </AppButton>
          )}
        </div>
        <div className={"border-4 m-4 rounded-md"}>
          {userSettings.musicEnabled ? (
            <AppButton
              onClick={toggleMusic}
              color={"regular"}
              className={"p-4"}
            >
              Disable Music
            </AppButton>
          ) : (
            <AppButton
              onClick={toggleMusic}
              color={"regular"}
              className={"p-4"}
            >
              Enable Music <BsMusicNoteBeamed />
            </AppButton>
          )}
        </div>
      </div>
    </div>
  );
}
