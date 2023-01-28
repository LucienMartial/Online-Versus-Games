const manifest = {
  bundles: [
    {
      name: "basic",
      assets: [
        {
          name: "character",
          srcs: "/character.png",
        },
        {
          name: "bubble",
          srcs: "../assets/animations/bubble.png",
        },
      ],
    },
    {
      name: "cosmetics",
      assets: [],
    },
  ],
};

interface CosmeticAssets {}

export { manifest };
export type { CosmeticAssets };
