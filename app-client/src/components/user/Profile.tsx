import { useEffect, useState } from "react";
import Overview from "./overview/Overview";
import History from "./History";
import { FiUser } from "react-icons/fi";
import { FaHistory } from "react-icons/all";
import LoadingPage from "../LoadingPage";

interface ProfileProps {
  username: string;
  handleRemoveAccount?: () => Promise<void>;
}

const activeTabStyle = "border-blue-400 text-blue-400";
const inactiveTabStyle = "border-blue-900";

export default function Profile({
  username,
  handleRemoveAccount,
}: ProfileProps) {
  const [currentTab, setCurrentTab] = useState("overview");
  const [exist, setExist] = useState<boolean | null>(null);

  function renderTabs() {
    switch (currentTab) {
      case "overview":
        return (
          <Overview
            username={username}
            handleRemoveAccount={handleRemoveAccount}
          />
        );
      case "history":
        return <History username={username} />;
    }
  }

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
  }, []);

  return (
    <main className="h-full flex flex-col min-h-0 grow">
      <div className="grid grid-cols-2 text-lg">
        <div
          className={`flex flex-row justify-center items-center cursor-pointer p-3 border-b-2 ${
            currentTab === "overview" ? activeTabStyle : inactiveTabStyle
          }`}
          onClick={() => setCurrentTab("overview")}
        >
          <FiUser className="inline-block mr-2" />
          <h2>Overview</h2>
        </div>
        <div
          className={`flex flex-row justify-center items-center cursor-pointer p-3 border-b-2 ${
            currentTab === "history" ? activeTabStyle : inactiveTabStyle
          }`}
          onClick={() => setCurrentTab("history")}
        >
          <FaHistory className="inline-block mr-2" />
          <h2>History</h2>
        </div>
      </div>
      {exist === null && (
        <main className="h-full flex flex-col min-h-0 grow justify-center items-center">
          <LoadingPage />
        </main>
      )}
      {exist && (
        <section className="min-h-0 grow flex flex-col">{renderTabs()}</section>
      )}
      {exist === false && (
        <section className="min-h-0 grow flex flex-col items-center justify-center">
          <h2 className="text-2xl">This user does not exist..</h2>
        </section>
      )}
    </main>
  );
}
