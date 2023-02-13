import { ComponentStory, ComponentMeta } from "@storybook/react";
import HistoryEntry from "../components/user/history/HistoryEntry";

export default {
  title: "user/HistoryEntry",
  component: HistoryEntry,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof HistoryEntry>;

const Template: ComponentStory<typeof HistoryEntry> = (args) => (
  <div className="p-4">
    <HistoryEntry {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  username: "riri",
  game: {
    timestamp: new Date(),
    players: [
      {
        user_id: "1023" as any,
        username: "riri",
        victory: true,
        stats: {
          deaths: 0,
          kills: 3,
          dashes: 1,
          lineShots: 13,
          curveShots: 14,
          shields: 10,
          shieldCatches: 7,
        },
      },
      {
        user_id: "2831" as any,
        username: "bob",
        victory: false,
        stats: {
          deaths: 3,
          kills: 0,
          dashes: 23,
          lineShots: 13,
          curveShots: 14,
          shields: 81,
          shieldCatches: 1,
        },
      },
    ],
  },
};
