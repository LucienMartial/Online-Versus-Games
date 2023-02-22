import { ComponentStory, ComponentMeta } from "@storybook/react";
import GameKeyboard from "../components/game/GameKeyboard";
import { MemoryRouter } from "react-router-dom";

export default {
  title: "game/GameKeyboard",
  component: GameKeyboard,
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
} as ComponentMeta<typeof GameKeyboard>;

const Template: ComponentStory<typeof GameKeyboard> = (args) => (
  <div className="p-4 flex gap-2">
    <GameKeyboard {...args}></GameKeyboard>
  </div>
);

export const Primary = Template.bind({});