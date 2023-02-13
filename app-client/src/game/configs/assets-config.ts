import { Texture } from "pixi.js";

const manifest = {
  bundles: [
    {
      name: "basic",
      assets: [
        {
          name: "character",
          srcs: "/character.png",
        },
      ],
    },
    {
      name: "animations",
      assets: [
        {
          name: "bubble",
          srcs: "../assets/animations/bubble.png",
        },
        {
          name: "red_square",
          srcs: "../assets/animations/red_square.png",
        },
      ],
    },
    {
      name: "cosmetics",
      assets: [
        {
          name: "red_eyes",
          srcs: "../assets/cosmetics/red_eyes.png",
        },
        {
          name: "gray_hat",
          srcs: "../assets/cosmetics/gray_hat.png",
        },
        {
          name: "red_cap",
          srcs: "../assets/cosmetics/red_cap.png",
        },
        {
          name: "black_sunglasses",
          srcs: "../assets/cosmetics/black_sunglasses.png",
        },
        {
          name: "pink_sunglasses",
          srcs: "../assets/cosmetics/pink_sunglasses.png",
        },
        {
          name: "gas_mask",
          srcs: "../assets/cosmetics/gas_mask.png",
        },
        {
          name: "gray_sunglasses",
          srcs: "../assets/cosmetics/gray_sunglasses.png",
        },
        {
          name: "brown_diving_mask",
          srcs: "../assets/cosmetics/brown_diving_mask.png",
        },
        {
          name: "black_hat",
          srcs: "../assets/cosmetics/black_hat.png",
        },
      ],
    },
  ],
};

interface CosmeticAssets {
  red_eyes: Texture;
  gray_hat: Texture;
  red_cap: Texture;
  black_sunglasses: Texture;
  pink_sunglasses: Texture;
  gas_mask: Texture;
  gray_sunglasses: Texture;
  brown_diving_mask: Texture;
  black_hat: Texture;
}

export { manifest };
export type { CosmeticAssets };
