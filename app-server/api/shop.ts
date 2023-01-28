import { Router } from "express";
import { Database } from "../database/database.js";
import { ApiShopData } from "../../app-shared/types/api-types.js";

// put all that in the database
const USER_COIN: number = 21;
const USER_ITEMS: number[] = [0, 3];
const userItemsConfig = { coins: USER_COIN, items: USER_ITEMS };

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
    res.status(200).json(userItemsConfig);
  });

  // response to the request to get user items

  router.post("/shop-buy", (req, res) => {
    // res.status(200).json(userItems);
  });

  return router;
}
