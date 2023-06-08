import { ComponentStory, ComponentMeta } from "@storybook/react";
import Overview from "../components/user/overview/Overview";
import { FriendsContext } from "../App";

export default {
  title: "user/Overview",
  component: Overview,
  decorators: [
    (Story) => (
      <FriendsContext.Provider
        value={
          {
            tryGetFriends: () => {},
            friendsRequestsData: { current: null },
          } as any
        }
      >
        <Story />
      </FriendsContext.Provider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Overview>;

const Template: ComponentStory<typeof Overview> = (args) => (
  <div className="flex flex-col h-screen w-screen justify-between">
    <Overview {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  username: "riri",
  profileData: {
    games: 102,
    wins: 48,
    stats: {
      deaths: 12,
      kills: 123,
      dashes: 321,
      lineShots: 241,
      curveShots: 31,
      shields: 87,
      shieldCatches: 13,
    },
  },
};
