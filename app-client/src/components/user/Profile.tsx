import { useState } from "react";
import Overview from "./Overview";
import History from "./History";
import { FiUser } from "react-icons/fi";
import { FaHistory } from "react-icons/all";

interface ProfileProps {
  username: string;
  handleRemoveAccount?: () => Promise<void>;
  isUser?: boolean;
}

const activeTabStyle = "border-blue-400 text-blue-400";
const inactiveTabStyle = "border-blue-900";

export default function Profile({
  username,
  isUser,
  handleRemoveAccount,
}: ProfileProps) {
  const [currentTab, setCurrentTab] = useState("overview");

  function renderTabs() {
    switch (currentTab) {
      case "overview":
        return (
          <Overview
            username={username}
            isUser={isUser}
            handleRemoveAccount={handleRemoveAccount}
          />
        );
      case "history":
        return <History username={username} />;
    }
  }

  function renderTitle() {
    switch (currentTab) {
      case "overview":
        return "Overview";
      case "history":
        return "History";
    }
  }

  return (
    <main className="h-full flex flex-col min-h-0">
      <div className=" grid grid-cols-2 text-lg">
        <div
          className={`flex flex-row justify-center items-center cursor-pointer p-4 border-b-2 ${
            currentTab === "overview" ? activeTabStyle : inactiveTabStyle
          }`}
          onClick={() => setCurrentTab("overview")}
        >
          <FiUser className="inline-block mr-2" />
          <h2>Overview</h2>
        </div>
        <div
          className={`flex flex-row justify-center items-center cursor-pointer p-4 border-b-2 ${
            currentTab === "history" ? activeTabStyle : inactiveTabStyle
          }`}
          onClick={() => setCurrentTab("history")}
        >
          <FaHistory className="inline-block mr-2" />
          <h2>History</h2>
        </div>
      </div>
      <section className="min-h-0 flex flex-col">
        <h1 className={"my-4"}>{renderTitle()}</h1>
        {renderTabs()}
      </section>
    </main>
  );
}
