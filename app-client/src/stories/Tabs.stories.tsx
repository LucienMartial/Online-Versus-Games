import { ComponentStory, ComponentMeta } from "@storybook/react";
import Tabs from "../components/lib/Tabs";
import { MemoryRouter } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { FaHistory } from "react-icons/fa";

export default {
  title: "lib/Tabs",
  component: Tabs,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/"]}>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Tabs>;

const Template: ComponentStory<typeof Tabs> = (args) => (
  <div className="flex flex-col">
    <Tabs {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  tabsDatas: [
    {
      title: "Tab1",
      logo: <FiUser />,
      content: <div>Tab1 content</div>,
    },
    {
      title: "Tab2",
      logo: <FaHistory />,
      content: <div>Tab2 content</div>,
    },
  ],
};
