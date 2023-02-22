import { ComponentStory, ComponentMeta } from "@storybook/react";
import StatCard from "../components/user/overview/StatCard";

export default {
  title: "user/StatCard",
  component: StatCard,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof StatCard>;

const Template: ComponentStory<typeof StatCard> = (args) => (
  <div className="p-4 w-1/4">
    <StatCard {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  name: "Deaths",
  average: 10.01,
  total: 1002,
};
