import { ComponentStory, ComponentMeta } from "@storybook/react";
import Footer from "../components/lib/Footer";
import { MemoryRouter } from "react-router-dom";

export default {
  title: "lib/Footer",
  component: Footer,
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
} as ComponentMeta<typeof Footer>;

const Template: ComponentStory<typeof Footer> = (args) => <Footer {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
