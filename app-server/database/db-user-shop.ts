import { ObjectId, WithId } from "mongodb";
import { Collection } from "mongodb";
import { SelectedItems, UserShop } from "../../app-shared/types/db-types.js";

export default function (userShops: Collection<UserShop>) {
  async function getUserShop(
    userId: ObjectId
  ): Promise<WithId<UserShop> | null> {
    try {
      const shopData = await userShops.findOneAndUpdate(
        { _id: userId },
        {
          $setOnInsert: {
            _id: userId,
            coins: 0,
            items: [-1, -2, -3],
            selectedItems: {
              skinID: -1,
              hatID: -2,
              faceID: -3,
            },
          },
        },
        { upsert: true, returnDocument: "after" }
      );
      return shopData.value;
    } catch (e) {
      if (e instanceof Error) console.log("user shop get error", e.message);
      return null;
    }
  }

  async function addCoins(userId: ObjectId, coins: number): Promise<boolean> {
    try {
      const shopData = await userShops.findOneAndUpdate(
        { _id: userId },
        {
          $inc: { coins: coins },
        },
        { upsert: true, returnDocument: "after" }
      );
      return shopData.ok === 1;
    } catch (e) {
      if (e instanceof Error)
        console.log("user shop add coins error", e.message);
      return false;
    }
  }

  async function selectUserShopItem(
    userId: ObjectId,
    selectedItems: SelectedItems
  ): Promise<boolean> {
    try {
      const shopData = await userShops.updateOne(
        { _id: userId },
        { $set: { selectedItems: selectedItems } }
      );
      return shopData.modifiedCount === 1;
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
      const shopData = await userShops.updateOne(
        { _id: userId },
        {
          $set: { coins: remainingCoins },
          $push: { items: itemId },
        }
      );
      return shopData.modifiedCount === 1;
    } catch (e) {
      if (e instanceof Error)
        console.log("user shop add item error", e.message);
      return false;
    }
  }

  return { getUserShop, selectUserShopItem, buyUserShopItem, addCoins };
}
