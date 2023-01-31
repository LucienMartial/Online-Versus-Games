import { useEffect, useState } from "react";
import Overview from "./overview/Overview";
import History from "./History";
import { FiUser } from "react-icons/fi";
import { FaHistory } from "react-icons/all";
import LoadingPage from "../LoadingPage";
import Tabs from "../lib/Tabs";
import { Profile } from "../../../../app-shared/types";

interface ProfileProps {
  username: string;
  handleRemoveAccount?: () => Promise<void>;
}

export default function ProfileView({
  username,
  handleRemoveAccount,
}: ProfileProps) {
  const [profileData, setProfileData] = useState<Profile | null>();

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/profile/" + username, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status !== 200) {
        setProfileData(null);
        return;
      }
      const profile: Profile = await res.json();
      setProfileData(profile);
    };
    load();
  }, [username]);

  console.log("PROFILE VIEW", profileData);

  if (profileData === undefined) {
    return (
      <main className="grow flex items-center justify-center">
        <LoadingPage />;
      </main>
    );
  }

  if (profileData === null) {
    return <h2 className="text-2xl">This user does not exist...</h2>;
  }

  return (
    <Tabs
      tabsDatas={[
        {
          title: "Overview",
          logo: <FiUser />,
          content: (
            <Overview
              profileData={profileData}
              username={username}
              handleRemoveAccount={handleRemoveAccount}
            />
          ),
        },
        {
          title: "History",
          logo: <FaHistory />,
          content: <History username={username} />,
        },
      ]}
    />
  );
}
