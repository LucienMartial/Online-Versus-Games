import { Client } from "colyseus";
import { ObjectId } from "mongodb";
import { SelectedItems, UserShop } from "../../app-shared/types/db-types.js";

async function syncCosmetics(
  client: Client,
  playerState: { cosmetic: { sync: (cosmetics: SelectedItems) => void } },
  dbGetUserShop: (id: ObjectId) => Promise<UserShop | undefined>,
) {
  {
    let cosmetics: SelectedItems = {
      skinID: -1,
      hatID: -2,
      faceID: -3,
    };

    try {
      const objectId = new ObjectId(client.userData.id);
      const userShop = await dbGetUserShop(objectId);
      if (userShop) {
        cosmetics = userShop.selectedItems;
      }
    } catch (e) {
      if (e instanceof Error) {
        console.error("could not fetch cosmetics", e.message);
      }
    }

    // set cosmetics
    console.log("cosmetics for ", client.userData.username, cosmetics);
    playerState.cosmetic.sync(cosmetics);
  }
}

export { syncCosmetics };
