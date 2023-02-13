import { ComponentStory, ComponentMeta } from "@storybook/react";
import AppButton from "../components/lib/AppButton";
import { MemoryRouter } from "react-router-dom";

export default {
  title: "lib/AppButton",
  component: AppButton,
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
} as ComponentMeta<typeof AppButton>;

const Template: ComponentStory<typeof AppButton> = (args) => (
  <div className="p-4 flex gap-2">
    <AppButton {...args}>Hello</AppButton>
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  color: "regular",
};
