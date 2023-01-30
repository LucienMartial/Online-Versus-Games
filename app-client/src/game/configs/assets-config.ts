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
        {
          name: "bubble",
          srcs: "../assets/animations/bubble.png",
        },
      ],
    },
    {
      name: "cosmetics",
      assets: [
        {
          name: "default_eye",
          srcs: "../assets/cosmetics/default_eye.png",
        },
        {
          name: "melon_hat",
          srcs: "../assets/cosmetics/melon_hat.png",
        },
        {
          name: "blue_cap",
          srcs: "../assets/cosmetics/blue_cap.png",
        },
        {
          name: "black_sunglasses",
          srcs: "../assets/cosmetics/black_sunglasses.png",
        },
        {
          name: "pink_sunglasses",
          srcs: "../assets/cosmetics/pink_sunglasses.png",
        },
      ],
    },
  ],
};

interface CosmeticAssets {
  default_eye: Texture;
  melon_hat: Texture;
  blue_cap: Texture;
  black_sunglasses: Texture;
  pink_sunglasses: Texture;
}

export { manifest };
export type { CosmeticAssets };