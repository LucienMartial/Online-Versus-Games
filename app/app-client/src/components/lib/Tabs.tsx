import { ReactNode, useState } from "react";

interface TabData {
  title: string;
  logo?: ReactNode;
  content: ReactNode;
}

interface TabsProps {
  tabsDatas: TabData[];
}

const activeTabStyle =
  "border-blue-700 dark:border-blue-400 text-blue-700 dark:text-blue-400";
const inactiveTabStyle = "border-blue-900";

export default function Tabs({ tabsDatas }: TabsProps) {
  const [currentTab, setCurrentTab] = useState(tabsDatas[0].title);

  return (
    <main className={"h-full flex flex-col min-h-0"}>
      <div className={`flex w-full text-lg`}>
        {tabsDatas.map((data) => (
          <div
            key={data.title}
            className={`w-full flex flex-row justify-center items-center cursor-pointer p-3 border-b-2 ${
              currentTab === data.title ? activeTabStyle : inactiveTabStyle
            }`}
            onClick={() => setCurrentTab(data.title)}
          >
            {data.logo && <div className="inline-block mr-2">{data.logo}</div>}
            <h2>{data.title}</h2>
          </div>
        ))}
      </div>
      {
        tabsDatas[tabsDatas.findIndex((header) => header.title === currentTab)]
          .content
      }
    </main>
  );
}
