import { ComponentStory, ComponentMeta } from "@storybook/react";
import ChatContainer from "../components/chat-components/ChatContainer";
import { MemoryRouter } from "react-router-dom";

export default {
  title: "chat/ChatContainer",
  component: ChatContainer,
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
} as ComponentMeta<typeof ChatContainer>;

const Template: ComponentStory<typeof ChatContainer> = (args) => (
  <div className="h-screen p-4 flex">
    <div className="bg-red-200 h-2/5 w-1/2">
      <ChatContainer {...args} />
    </div>
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  chatRoom: {
    onMessage: () => {},
  } as any,
};
