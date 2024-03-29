import { Router, Request, Response } from "express";
import { Database } from "../database/database.js";
import {
  UserShop,
  SelectedItems,
  ItemTarget,
  Item,
} from "../../app-shared/types/index.js";
import { getItem } from "../../app-shared/configs/shop-config.js";
import { AppError } from "../utils/error.js";
import { ObjectId, WithId } from "mongodb";

export default function (db: Database): Router {
  const router = Router({ mergeParams: true });

  async function getShopData(req: Request): Promise<WithId<UserShop>> {
    const id = req.session.id;
    if (!req.session.authenticated || !id)
      throw new AppError(400, "User not connected");
    const objectId = new ObjectId(id);
    const userShop = await db.getUserShop(objectId);
    if (!userShop) throw new AppError(500, "Could not fetch user shop data");
    return userShop;
  }

  // response to the request to get user coins

  router.get("/shop", async (req: Request, res: Response) => {
    const userShop = await getShopData(req);
    res.status(200).json(userShop);
  });

  // response to the request to get user items

  router.post("/shop-buy", async (req: Request, res: Response) => {
    // get user data
    const data: ItemTarget = req.body;
    const items: Item[] = [];
    for (const item of data.itemId) {
      const itemGet = getItem(item);
      if (itemGet !== null) {
        items.push(itemGet);
      } else {
        throw new AppError(400, "Bad item ID");
      }
    }
    if (
      data.itemId === undefined ||
      data.itemId === null ||
      items.length === 0 ||
      items.length > 3
    ) {
      throw new AppError(400, "Client body shall be a valid item target");
    }

    // get user shop
    const userShop = await getShopData(req);

    // verify purchase
    let remainingCoins = userShop.coins;

    for (const item of items) {
      if (
        !userShop.items.every((shopItem) => {
          return shopItem !== item.id;
        })
      ) {
        throw new AppError(400, "Item(s) already owned");
      }

      remainingCoins -= item.price;
    }

    if (remainingCoins < 0) {
      throw new AppError(400, "Not enough coin to buy item");
    }

    for (const item of items) {
      // pursue transaction
      const result = await db.buyUserShopItem(
        userShop._id,
        item.id,
        remainingCoins
      );
      if (!result)
        throw new AppError(500, "Could not pursue user shop transaction");
    }

    res.status(200).end();
  });

  router.post("/shop-select", async (req: Request, res: Response) => {
    // get body, verify integrity
    const cosmeticData: SelectedItems = req.body;
    [
      { id: cosmeticData.faceID, category: "face" },
      { id: cosmeticData.hatID, category: "hat" },
      { id: cosmeticData.skinID, category: "skin" },
    ].map(({ id, category }) => {
      if (id === null || id === undefined)
        throw new AppError(
          400,
          "Client body should be a selection of cosmetics"
        );
      const item = getItem(id);
      if (item.category !== category)
        throw new AppError(400, "Cosmetics selection shall be valid");
    });

    // check if user own items
    const userShop = await getShopData(req);
    if (
      !(
        userShop.items.includes(cosmeticData.faceID) &&
        userShop.items.includes(cosmeticData.hatID) &&
        userShop.items.includes(cosmeticData.skinID)
      )
    ) {
      throw new AppError(400, "Cosmetics selection not posseded");
    }

    // select new cosmetic items
    const result = await db.selectUserShopItem(userShop._id, cosmeticData);
    if (!result) throw new AppError(500, "Could not select cosmetic items");

    res.status(200).end();
  });

  return router;
}
