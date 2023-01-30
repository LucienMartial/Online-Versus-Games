import { ObjectId, WithId } from "mongodb";
import { Collection } from "mongodb";
import { SelectedItems, UserShop } from "../../app-shared/types/db-types.js";

export default function (userShops: Collection<UserShop>) {
  async function getUserShop(
    userId: ObjectId
  ): Promise<WithId<UserShop> | null> {
    try {
      // TODO
    } catch (e) {
      if (e instanceof Error) console.log("user shop get error", e.message);
      return null;
    }
  }

  async function selectUserShopItem(
    userId: ObjectId,
    selectedItems: SelectedItems
  ): Promise<boolean> {
    try {
      // TODO
    } catch (e) {
      if (e instanceof Error) console.log("user shop select error", e.message);
      return false;
    }
  }

  async function buyUserShopItem(
    userId: ObjectId,
    itemId: number,
    remainingCoins: number
  ): Promise<boolean> {
    try {
      // TODO
    } catch (e) {
      if (e instanceof Error)
        console.log("user shop add item error", e.message);
      return false;
    }
  }

  return { getUserShop, selectUserShopItem, buyUserShopItem };
}
