import { Schema, type } from "@colyseus/schema";
import { SelectedItems } from "../types/db-types.js";

class CosmeticState extends Schema {
  @type("number")
  skinID = 0;
  @type("number")
  hatID = 0;
  @type("number")
  faceID = 0;

  sync(cosmetics: SelectedItems) {
    this.skinID = cosmetics.skinID;
    this.hatID = cosmetics.hatID;
    this.faceID = cosmetics.faceID;
  }
}

export { CosmeticState };
