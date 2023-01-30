import { StrictMode, useEffect, useState } from "react";
import { ShopItem } from "./ShopItem";
import { UserShop, SelectedItems } from "../../../../app-shared/types";
import {
  SHOP_ITEMS,
  getItem,
} from "../../../../app-shared/configs/shop-config";
import { ItemTarget } from "../../../../app-shared/types";
import AppButton from "../lib/AppButton";

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

const activeTabStyle = "border-blue-400 text-blue-400";
const inactiveTabStyle = "border-blue-900";

export default function Shop() {
  const [shopData, setShopData] = useState<UserShop | null>(null);
  const [serverSelectedItems, setServerSelectedItems] =
    useState<SelectedItems | null>(null);
  const [currentTab, setCurrentTab] = useState<string>("skin");
  const [grayedOut, setGrayedOut] = useState<boolean>(true);

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
        setServerSelectedItems(data.selectedItems);
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
      body: JSON.stringify({ itemId: id } satisfies ItemTarget),
    });
    if (res.status === 200) {
      return true;
    }
    const err: Error = await res.json();
    console.log(err);
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

  async function selectCharacterServer(): Promise<boolean> {
    if (!shopData) return false;
    const res = await fetch("/api/shop-select", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shopData.selectedItems satisfies SelectedItems),
    });
    if (res.status === 200) {
      setServerSelectedItems(shopData.selectedItems);
      setGrayedOut(true);
      return true;
    }
    const err: Error = await res.json();
    console.log(err);
    return false;
  }

  function trySelect(id: number): void {
    if (!shopData) return;
    setShopData({
      ...shopData,
      selectedItems: replaceSelectedItem(id, shopData.selectedItems),
    });

    if (serverSelectedItems) {
      if (
        shopData.selectedItems.faceID === serverSelectedItems.faceID &&
        shopData.selectedItems.hatID === serverSelectedItems.hatID &&
        shopData.selectedItems.skinID === serverSelectedItems.skinID
      ) {
        setGrayedOut(false);
      } else {
        setGrayedOut(true);
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
      return item.category === currentTab ? (
        <ShopItem
          id={item.id}
          name={item.name}
          price={item.price}
          category={item.category}
          owned={owned}
          selected={selected}
          tryBuy={tryBuy}
          trySelect={trySelect}
          key={item.id}
        />
      ) : null;
    });
  }

  return (
    <StrictMode>
      <main className={"h-full flex flex-col min-h-0 grow"}>
        <section className={""}>
          <p className={"text-2xl"}>You have {shopData?.coins} coins</p>
        </section>
        <section className={""}>
          <div className={"float-left"}>HERE WILL APEAR THE SKIN PREVIEW</div>
          <div className={"float-right"}>
            <div className={"grid grid-cols-3 text-lg"}>
              <div
                className={`flex flex-row justify-center items-center cursor-pointer p-3 border-b-2 ${
                  currentTab === "skin" ? activeTabStyle : inactiveTabStyle
                }`}
                onClick={() => setCurrentTab("skin")}
              >
                SKIN
              </div>
              <div
                className={`flex flex-row justify-center items-center cursor-pointer p-3 border-b-2 ${
                  currentTab === "hat" ? activeTabStyle : inactiveTabStyle
                }`}
                onClick={() => setCurrentTab("hat")}
              >
                HAT
              </div>
              <div
                className={`flex flex-row justify-center items-center cursor-pointer p-3 border-b-2 ${
                  currentTab === "face" ? activeTabStyle : inactiveTabStyle
                }`}
                onClick={() => setCurrentTab("face")}
              >
                FACE
              </div>
              <AppButton
                className={"col-span-3"}
                color={"regular"}
                onClick={selectCharacterServer}
                grayedOut={grayedOut}
              >
                Select character
              </AppButton>
            </div>
            <div className={"min-h-0 grow flex flex-col"}>{renderItems()}</div>
          </div>
        </section>
      </main>
    </StrictMode>
  );
}
