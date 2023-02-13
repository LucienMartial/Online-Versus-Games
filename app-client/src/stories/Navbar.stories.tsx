import { ComponentStory, ComponentMeta } from "@storybook/react";
import Navbar from "../components/lib/Navbar";
import { MemoryRouter } from "react-router-dom";

export default {
  title: "lib/Navbar",
  component: Navbar,
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
} as ComponentMeta<typeof Navbar>;

const Template: ComponentStory<typeof Navbar> = (args) => (
  <div className="flex">
    <Navbar {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {};
