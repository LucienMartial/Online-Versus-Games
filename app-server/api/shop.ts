import { Router, Request, Response } from "express";
import { Database } from "../database/database.js";
import {
  UserShop,
  SelectedItems,
  ItemTarget,
} from "../../app-shared/types/index.js";
import { getItem, SHOP_ITEMS } from "../../app-shared/configs/shop-config.js";
import { Item } from "../../app-shared/types/index.js";
import { AppError } from "../utils/error.js";
import { WithId } from "mongodb";

// put all that in the database
let userCoins: number = 4;
let userItems: number[] = [-1, -2, -3];
let userSelectedItems: SelectedItems = {
  skinID: -1,
  hatID: -2,
  faceID: -3,
};
const fakeUserShopData: UserShop = {
  coins: userCoins,
  items: userItems,
  selectedItems: userSelectedItems,
};

// *********************************************************** //

function setUserSelectedItems(id: number): string | null {
  const item = getItem(id);
  if (!item) return "Item not found";
  if (!userItems.includes(id)) return "You don't have this item";

  switch (item.category) {
    case "skin":
      userSelectedItems.skinID = id;
      break;
    case "hat":
      userSelectedItems.hatID = id;
      break;
    case "face":
      userSelectedItems.faceID = id;
      break;
    default:
      break;
  }

  return null;
}

function buyItem(id: number): string | null {
  const item: Item = getItem(id);
  if (item === null) return "Item not found";
  if (userCoins < item.price) return "Not enough coins";
  if (userItems.includes(id)) return "You already have this item";
  userCoins -= item.price;
  userItems.push(id);
  return null;
}

export default function (db: Database): Router {
  const router = Router({ mergeParams: true });

  /*
    I don't know how the fuck this shit works, but I have to get
    the body of my POST request. It send the ID of the product the user
    wanna buy. I have to check if the user have enough coins, and if he
    have, I have to do the transaction and send back a 200 status code.

    I have to send back a 400 status code if the user don't have enough
    coins, and a 500 status code if there is an error.

    To do this I must compare the amount of coins the user have in the
    database with the amount of coins the ID of the product have in the
    database. If the user have enough coins, I have to do the transaction.
    If the user already have the product, I have to send back a 400 status.

    Of course the items are just client skins so everyone can have them by
    modifying the client code.
  */

  async function getShopData(req: Request): Promise<WithId<UserShop>> {
    const id = req.session.id;
    if (!req.session.authenticated || !id)
      throw new AppError(400, "User not connected");
    const userShop = await db.getUserShop(id);
    if (!userShop) throw new AppError(500, "Could not fetch user shop data");
    return userShop;
  }

  // response to the request to get user coins

  router.get("/shop", async (req: Request, res: Response) => {
    // const userShop = await getShopData(req);
    res.status(200).json(fakeUserShopData);
  });

  // response to the request to get user items

  router.post("/shop-buy", async (req: Request, res: Response) => {
    // get user data
    const data: ItemTarget = req.body;
    const item = getItem(data.itemId);
    if (!data.itemId || !item)
      throw new AppError(400, "Client body shall be a valid item target");

    // get user shop
    const userShop = await getShopData(req);

    // verify purchase
    const remainingCoins = userShop.coins - item.price;
    if (remainingCoins < 0)
      throw new AppError(400, "Not enough coin to buy item");

    // pursue transaction
    const result = await db.buyUserShopItem(
      userShop._id,
      item.id,
      remainingCoins
    );
    if (!result)
      throw new AppError(500, "Could not pursue user shop transaction");

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
      if (!id)
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
    )
      throw new AppError(400, "Cosmetics selection not posseded");

    // select new cosmetic items
    const result = await db.selectUserShopItem(userShop._id, cosmeticData);
    if (!result) throw new AppError(500, "Could not select cosmetic items");

    res.status(200).end();
  });

  return router;
}
