import { useEffect, useState } from "react";
import Overview from "./overview/Overview";
import History from "./History";
import { FiUser } from "react-icons/fi";
import { FaHistory } from "react-icons/all";
import LoadingPage from "../LoadingPage";
import Tabs from "../lib/Tabs";

interface ProfileProps {
  username: string;
  handleRemoveAccount?: () => Promise<void>;
}

export default function Profile({
  username,
  handleRemoveAccount,
}: ProfileProps) {
  const [exist, setExist] = useState<boolean | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/profile/" + username, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status !== 200) setExist(false);
      else setExist(true);
    };
    load();
  }, [username]);

  if (exist === null) return <LoadingPage />;
  if (!exist) return <h2 className="text-2xl">This user does not exist...</h2>;
  return (
    <Tabs
      tabsDatas={[
        {
          title: "Overview",
          logo: <FiUser />,
          content: (
            <Overview
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
