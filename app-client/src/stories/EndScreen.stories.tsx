import { ComponentMeta, ComponentStory } from "@storybook/react";
import EndScreen from "../disc-war/components/EndScreen";
import { MemoryRouter } from "react-router-dom";

export default {
  title: "discwar/EndScreen",
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
        deaths: 2,
        stats: {
          kills: 3,
          dashes: 2,
          shields: 22,
          shieldCatches: 5,
          straightShots: 1,
          curveShots: 23,
          death: 2,
        },
      },
      bob: {
        username: "bob",
        victory: false,
        deaths: 3,
        kills: 2,
        stats: {
          dashes: 10,
          shields: 3,
          shieldCatches: 1,
          straightShots: 8,
          curveShots: 9,
          death: 3,
        },
      },
    } as any,
  } as any,
};
