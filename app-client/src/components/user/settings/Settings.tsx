import { useContext, useEffect, useState } from "react";
import switchAudio from "/assets/sounds/click-button.mp3";
import AppButton from "../../lib/AppButton";
import { UserSettingsContext, UserSettingsContextType } from "../../../App";
import { BsFillVolumeMuteFill, BsFillVolumeUpFill } from "react-icons/bs";
import { MdMusicNote, MdMusicOff } from "react-icons/md";

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
        <div
          className={
            "flex border-2 border-slate-100 hover:border-slate-300 m-4 rounded-md"
          }
        >
          {userSettings.soundEnabled ? (
            <AppButton
              onClick={toggleSound}
              color={"regular"}
              className={"p-4 items-center text-xl"}
            >
              Sound enabled{" "}
              <BsFillVolumeUpFill className={"inline-block ml-2 text-2xl"} />
            </AppButton>
          ) : (
            <AppButton
              onClick={toggleSound}
              color={"warning"}
              className={"p-4 items-center text-xl"}
            >
              Sound disabled{" "}
              <BsFillVolumeMuteFill className={"inline-block ml-2 text-2xl"} />
            </AppButton>
          )}
        </div>
        <div
          className={
            "flex border-2 border-slate-100 hover:border-slate-300 m-4 rounded-md"
          }
        >
          {userSettings.musicEnabled ? (
            <AppButton
              onClick={toggleMusic}
              color={"regular"}
              className={"p-4 items-center text-xl"}
            >
              Music enabled{" "}
              <MdMusicNote className={"inline-block ml-2 text-2xl"} />
            </AppButton>
          ) : (
            <AppButton
              onClick={toggleMusic}
              color={"warning"}
              className={"p-4 items-center text-xl"}
            >
              Music disabled{" "}
              <MdMusicOff className={"inline-block ml-2 text-2xl"} />
            </AppButton>
          )}
        </div>
      </div>
    </div>
  );
}
