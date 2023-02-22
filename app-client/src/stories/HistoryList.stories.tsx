import { ComponentStory, ComponentMeta } from "@storybook/react";
import HistoryList from "../components/user/history/HistoryList";

export default {
  title: "user/HistoryList",
  component: HistoryList,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof HistoryList>;

const Template: ComponentStory<typeof HistoryList> = (args) => (
  <HistoryList {...args} />
);

const dummy_game = {
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
};

export const Primary = Template.bind({});
Primary.args = {
  username: "riri",
  games: Array(20).fill(dummy_game),
};
