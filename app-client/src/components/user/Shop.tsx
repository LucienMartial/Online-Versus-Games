import { StrictMode, useEffect, useState } from "react";
import { ShopItem } from "./ShopItem";
import { ApiShopData } from "../../../../app-shared/types";
import {
  SHOP_ITEMS,
  getItem,
} from "../../../../app-shared/configs/shop-config";

export default function Shop() {
  const [shopData, setShopData] = useState<ApiShopData | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/shop", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        const data = (await res.json()) as ApiShopData;
        setShopData(data);
      }
    }
    load();
  }, []);

  async function tryBuyServer(id: number): Promise<boolean> {
    const res = await fetch("/api/shop-buy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    if (res.status === 200) {
      return true;
    }
    return false;
  }

  async function tryBuy(id: number) {
    const item = getItem(id);
    if (item && shopData) {
      if (shopData.coins >= item.price) {
        const success = await tryBuyServer(id);
        if (success) {
          setShopData({
            coins: shopData.coins - item.price,
            items: [...shopData.items, item.id],
          });
        }
      }
    }
  }

  function renderItems() {
    const itemSet = new Set(shopData?.items);
    return SHOP_ITEMS.map((item) => {
      const owned = itemSet.has(item.id);
      return (
        <ShopItem
          id={item.id}
          name={item.name}
          price={item.price}
          owned={owned}
          tryBuy={tryBuy}
          key={item.id}
        />
      );
    });
  }

  return (
    <StrictMode>
      <main className="h-full flex flex-col min-h-0 grow">
        <div className="flex flex-row justify-between items-center p-3 border-b-2">
          <p className="text-2xl">Shop</p>
          <p className="text-2xl">You have {shopData?.coins} coins</p>
        </div>
        <section className="min-h-0 grow flex flex-col">
          {renderItems()}
        </section>
      </main>
    </StrictMode>
  );
}
