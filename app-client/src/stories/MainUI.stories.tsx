import { ComponentStory, ComponentMeta } from "@storybook/react";
import MainUI from "../components/lib/MainUI";
import { MemoryRouter } from "react-router-dom";

export default {
  title: "lib/MainUI",
  component: MainUI,
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
} as ComponentMeta<typeof MainUI>;

const Template: ComponentStory<typeof MainUI> = (args) => <MainUI {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
