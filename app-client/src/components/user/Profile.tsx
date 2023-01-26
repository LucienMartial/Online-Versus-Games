import { useState } from "react";
import Overview from "./Overview";
import History from "./History";

interface ProfileProps {
  username: string;
}

const activeTabStyle = "border-blue-400 text-blue-400";
const inactiveTabStyle = "border-blue-900";

export default function Profile({ username }: ProfileProps) {
  const [currentTab, setCurrentTab] = useState("overview");

  function renderTabs() {
    switch (currentTab) {
      case "overview":
        return <Overview username={username} />;
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
      <div className=" grid grid-cols-2 text-xl">
        <h2
          className={`cursor-pointer p-4 border-b-2 ${
            currentTab === "overview" ? activeTabStyle : inactiveTabStyle
          }`}
          onClick={() => setCurrentTab("overview")}
        >
          Overview
        </h2>
        <h2
          className={`cursor-pointer p-4 border-b-2 ${
            currentTab === "history" ? activeTabStyle : inactiveTabStyle
          }`}
          onClick={() => setCurrentTab("history")}
        >
          History
        </h2>
      </div>
      <section className="min-h-0 flex flex-col">
        <h1 className={"my-4"}>{renderTitle()}</h1>
        {renderTabs()}
      </section>
    </main>
  );
}
