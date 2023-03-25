import { ComponentMeta, ComponentStory } from "@storybook/react";
import EndScreen from "../tag-war/components/TagWarEndScreen";
import { MemoryRouter } from "react-router-dom";

export default {
  title: "tagwar/EndScreen",
  component: EndScreen,
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
} as ComponentMeta<typeof EndScreen>;

const Template: ComponentStory<typeof EndScreen> = (args) => (
  <EndScreen {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  gameScene: { id: "riri" } as any,
  chatRoom: { onMessage: () => {}, leave: () => {} } as any,
  setGameRoom: () => {},
  endGameState: {
    id: "",
    players: {
      riri: {
        username: "riri",
        victory: true,
      },
      bob: {
        username: "bob",
        victory: false,
      },
    } as any,
  } as any,
};
