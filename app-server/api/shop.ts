import { Router } from "express";
import { Database } from "../database/database.js";
import {
  ApiShopData,
  ApiSelectedItems,
} from "../../app-shared/types/api-types.js";
import { getItem } from "../../app-shared/configs/shop-config.js";
import { Item } from "../../app-shared/types/index.js";

// put all that in the database
let userCoins: number = 4;
let userItems: number[] = [-1, -2, -3];
let userSelectedItems: ApiSelectedItems = {
  skinID: -1,
  hatID: -2,
  faceID: -3,
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

  // response to the request to get user coins

  router.get("/shop", (req, res) => {
    const userItemsConfig: ApiShopData = {
      coins: userCoins,
      items: userItems,
      selectedItems: userSelectedItems,
    };
    res.status(200).json(userItemsConfig);
  });

  // response to the request to get user items

  router.post("/shop-buy", (req, res) => {
    const error: string | null = buyItem(req.body.id);
    if (!error) {
      res.status(200).json({ status: 0, error: "no error" });
    } else {
      res.status(400).json({ status: -1, error: error });
    }
  });

  router.post("/shop-select", (req, res) => {
    const error = setUserSelectedItems(req.body.id);
    if (!error) {
      res.status(200).json({ status: 0, error: "no error" });
    } else {
      res.status(400).json({ status: -1, error: error });
    }
  });

  return router;
}
