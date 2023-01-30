import { StrictMode, useEffect, useState } from "react";
import { ShopItem } from "./ShopItem";
import { UserShop, SelectedItems } from "../../../../app-shared/types";
import {
  SHOP_ITEMS,
  getItem,
} from "../../../../app-shared/configs/shop-config";

function replaceSelectedItem(
  id: number,
  selectedItems: SelectedItems
): SelectedItems {
  const IDItem = getItem(id);
  const category = IDItem?.category;

  switch (category) {
    case "skin":
      return { ...selectedItems, skinID: id };
    case "hat":
      return { ...selectedItems, hatID: id };
    case "face":
      return { ...selectedItems, faceID: id };
  }

  return selectedItems;
}

export default function Shop() {
  const [shopData, setShopData] = useState<UserShop | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/shop", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        const data: UserShop = await res.json();
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
    const data = await res.json();
    if (res.status === 200) {
      return true;
    }
    return false;
  }

  async function tryBuy(id: number): Promise<void> {
    const item = getItem(id);
    if (item && shopData) {
      if (shopData.coins >= item.price) {
        const success = await tryBuyServer(id);
        if (success) {
          setShopData({
            coins: shopData.coins - item.price,
            items: [...shopData.items, item.id],
            selectedItems: replaceSelectedItem(id, shopData.selectedItems),
          });
        }
      }
    }
  }

  async function trySelectServer(id: number): Promise<boolean> {
    const res = await fetch("/api/shop-select", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    const data = await res.json();
    if (res.status === 200) {
      return true;
    }
    return false;
  }

  async function trySelect(id: number): Promise<void> {
    const item = getItem(id);
    if (item && shopData) {
      const success = await trySelectServer(id);
      if (success) {
        setShopData({
          ...shopData,
          selectedItems: replaceSelectedItem(id, shopData.selectedItems),
        });
      }
    }
  }

  function renderItems() {
    const itemSet = new Set(shopData?.items);
    const selectedItems = shopData?.selectedItems;
    return SHOP_ITEMS.map((item) => {
      const owned = itemSet.has(item.id);
      const selected =
        selectedItems?.skinID === item.id ||
        selectedItems?.hatID === item.id ||
        selectedItems?.faceID === item.id;
      return (
        <ShopItem
          id={item.id}
          name={item.name}
          price={item.price}
          owned={owned}
          selected={selected}
          tryBuy={tryBuy}
          trySelect={trySelect}
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
