import gameInfosType from "../types/gameInfosType";

const gamesInfos: gameInfosType[] = [
  {
    name: "Disc War",
    queueName: "queue-disc-war",
    id: "disc-war",
    description: "A game where you have to throw discs at your opponents",
    keybinds: [
      {
        key: ["Q", "A", "Left Arrow"],
        description: "Move left",
      },
      {
        key: ["D", "Right Arrow"],
        description: "Move right",
      },
      {
        key: ["W", "Z", "Up Arrow"],
        description: "Move up",
      },
      {
        key: ["S", "Down Arrow"],
        description: "Move down",
      },
      {
        key: ["Space"],
        description: "Do a dash",
      },
      {
        key: ["Shift"],
        description: "Use your shield",
      },
      {
        key: ["Left Click", "One Finger Tap"],
        description: "Throw a disc linearly",
      },
      {
        key: ["Right Click", "Two Fingers Tap"],
        description: "Throw a curved disc",
      },
    ],
  },
  {
    name: "Tag War",
    queueName: "queue-tag-war",
    id: "tag-war",
    description: "A game where you have to tag your opponents",
    keybinds: [
      {
        key: ["Q", "A", "Left Arrow"],
        description: "Move left",
      },
      {
        key: ["D", "Right Arrow"],
        description: "Move right",
      },
      {
        key: ["W", "Z", "Up Arrow"],
        description: "Move up",
      },
      {
        key: ["S", "Down Arrow"],
        description: "Move down",
      },
      /* TODO: add keybinds */
    ],
  },
];

export default gamesInfos;
