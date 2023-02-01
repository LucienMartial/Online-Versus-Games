import { StrictMode, useEffect, useState } from "react";
import { ShopItem } from "./ShopItem";
import { UserShop, SelectedItems, Item } from "../../../../../app-shared/types";
import {
  SHOP_ITEMS,
  getItem,
} from "../../../../../app-shared/configs/shop-config";
import { ItemTarget } from "../../../../../app-shared/types";
import AppButton from "../../lib/AppButton";
import { AiFillSkin } from "react-icons/ai";
import { FaHatCowboy } from "react-icons/fa";
import { BsEmojiSunglasses } from "react-icons/bs";
import Tabs from "../../lib/Tabs";

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
  const [serverSelectedItems, setServerSelectedItems] =
    useState<SelectedItems | null>(null);
  const [grayedOut, setGrayedOut] = useState<boolean>(true);
  const [previewItem, setPreviewItem] = useState<SelectedItems | null>(null);
  const [payingSkin, setPayingSkin] = useState<number>(0);

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
        setPreviewItem(data.selectedItems);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (serverSelectedItems && previewItem) {
      if (
        previewItem.faceID === serverSelectedItems.faceID &&
        previewItem.hatID === serverSelectedItems.hatID &&
        previewItem.skinID === serverSelectedItems.skinID
      ) {
        setGrayedOut(true);
      } else {
        setGrayedOut(false);
      }
    }
  }, [shopData, previewItem, serverSelectedItems]);

  useEffect(() => {
    if (previewItem) {
      let payingSkinPrice = 0;
      const faceItem = getItem(previewItem.faceID);
      const hatItem = getItem(previewItem.hatID);
      const skinItem = getItem(previewItem.skinID);

      if (previewItem.faceID !== shopData?.selectedItems.faceID && faceItem) {
        payingSkinPrice += faceItem.price;
      }

      if (previewItem.hatID !== shopData?.selectedItems.hatID && hatItem) {
        payingSkinPrice += hatItem.price;
      }

      if (previewItem.skinID !== shopData?.selectedItems.skinID && skinItem) {
        payingSkinPrice += skinItem.price;
      }
      setPayingSkin(payingSkinPrice);
    }
  }, [previewItem]);

  async function selectJsonPostRequest(data: SelectedItems): Promise<Response> {
    const res = await fetch("/api/shop-select", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data satisfies SelectedItems),
    });

    return res;
  }

  async function selectCharacterServer(
    replacedItems: SelectedItems | null = null
  ): Promise<boolean> {
    if (!shopData || !previewItem) return false;
    let res = null;
    const itemsToBuy: number[] = [];
    if (replacedItems === null) {
      if (previewItem.faceID !== shopData?.selectedItems.faceID) {
        itemsToBuy.push(previewItem.faceID);
      }
      if (previewItem.hatID !== shopData?.selectedItems.hatID) {
        itemsToBuy.push(previewItem.hatID);
      }
      if (previewItem.skinID !== shopData?.selectedItems.skinID) {
        itemsToBuy.push(previewItem.skinID);
      }
      const resBuySkin =
        itemsToBuy.length === 0 ? true : await tryBuySkinServer(itemsToBuy);
      if (!resBuySkin) {
        return false;
      }
      res = await selectJsonPostRequest(previewItem);
    } else {
      res = await selectJsonPostRequest(replacedItems);
    }
    if (res === null) return false;
    if (res.status === 200) {
      if (replacedItems) {
        setServerSelectedItems(replacedItems);
      } else {
        setServerSelectedItems(previewItem);

        let totalCoins = shopData.coins;
        let replacedItems = shopData.selectedItems;

        for (const itemId of itemsToBuy) {
          const itemData = getItem(itemId);
          if (itemData) {
            totalCoins -= itemData.price;
          }
          replacedItems = replaceSelectedItem(itemId, replacedItems);
        }
        setShopData({
          coins: totalCoins,
          items: [...shopData.items, ...itemsToBuy],
          selectedItems: replacedItems,
        });
      }
      return true;
    }
    const err: Error = await res.json();
    console.log(err);
    return false;
  }

  function trySelect(id: number): void {
    if (!shopData) return;
    const newSelectedItems = replaceSelectedItem(id, shopData.selectedItems);
    setShopData({
      ...shopData,
      selectedItems: newSelectedItems,
    });
    if (!previewItem) return;
    const newPreviewItem = replaceSelectedItem(id, previewItem);
    setPreviewItem(newPreviewItem);
  }

  function tryPreview(id: number): void {
    if (!previewItem) return;
    const newPreviewItem = replaceSelectedItem(id, previewItem);
    setPreviewItem(newPreviewItem);
  }

  async function buyJsonPosetRequest(ids: number[]): Promise<Response> {
    const res = await fetch("/api/shop-buy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId: ids } satisfies ItemTarget),
    });

    return res;
  }

  async function tryBuyServer(id: number): Promise<boolean> {
    if (!shopData) return false;
    const res = await buyJsonPosetRequest([id]);
    if (res.status === 200) {
      const replacedItems = replaceSelectedItem(id, shopData.selectedItems);
      const resSelectCharacter = await selectCharacterServer(replacedItems);
      if (resSelectCharacter) {
        setShopData({
          ...shopData,
          selectedItems: replacedItems,
        });
        setPreviewItem(replacedItems);
      }
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

  async function tryBuySkinServer(ids: number[]): Promise<boolean> {
    if (!shopData) return false;
    const res = await buyJsonPosetRequest(ids);
    if (res.status === 200) {
      return true;
    }
    const err: Error = await res.json();
    console.log(err);
    return false;
  }

  function renderItems(category: string) {
    const itemSet = new Set(shopData?.items);
    const selectedItems = shopData?.selectedItems;
    return SHOP_ITEMS.map((item) => {
      const owned = itemSet.has(item.id);
      const selected =
        selectedItems?.skinID === item.id ||
        selectedItems?.hatID === item.id ||
        selectedItems?.faceID === item.id;
      const previewed =
        previewItem?.skinID === item.id ||
        previewItem?.hatID === item.id ||
        previewItem?.faceID === item.id;
      return item.category === category ? (
        <ShopItem
          id={item.id}
          name={item.name}
          price={item.price}
          category={item.category}
          owned={owned}
          selected={selected}
          previewed={previewed}
          tryBuy={tryBuy}
          trySelect={trySelect}
          tryPreview={tryPreview}
          key={item.id}
        />
      ) : null;
    });
  }

  function renderPayingSkin(): string {
    if (payingSkin === 0) {
      return "";
    }

    if (payingSkin === 1) {
      return "(" + payingSkin + " coin)";
    }

    return "(" + payingSkin + " coins)";
  }

  return (
    <StrictMode>
      <main className={"h-full flex flex-col min-h-0 grow"}>
        <section className={""}>
          <p className={"text-2xl"}>
            You have {shopData?.coins ? shopData.coins : "0 coins"}{" "}
            {shopData?.coins && shopData?.coins > 1 ? "coins" : "coin"}
          </p>
        </section>
        <section className={"grid grid-cols-1 sm:grid-cols-2 h-full min-h-0"}>
          <div className={"grid grid-rows-2 h-full"}>
            <div>
              HERE WILL APEAR THE SKIN PREVIEW
              <br />
              <br />
              PREVIEWED ITEMS
              <br />
              {"Skin: " + previewItem?.skinID}
              <br />
              {"Hat: " + previewItem?.hatID}
              <br />
              {"Face: " + previewItem?.faceID}
              <br />
              <br />
            </div>
            <div>
              <AppButton
                className={"font-bold h-16 w-52"}
                color={"regular"}
                onClick={selectCharacterServer}
                grayedOut={grayedOut}
              >
                Choose character {renderPayingSkin()}
              </AppButton>
            </div>
          </div>
          <div className={"h-full min-h-0"}>
            <Tabs
              tabsDatas={[
                {
                  title: "Skin",
                  logo: <AiFillSkin />,
                  content: (
                    <div
                      className={
                        "grid grid-cols-2 overflow-y-scroll max-h-full min-h-0"
                      }
                    >
                      {renderItems("skin")}
                    </div>
                  ),
                },
                {
                  title: "Hat",
                  logo: <FaHatCowboy />,
                  content: (
                    <div
                      className={
                        "grid grid-cols-2 overflow-y-scroll max-h-full min-h-0"
                      }
                    >
                      {renderItems("hat")}
                    </div>
                  ),
                },
                {
                  title: "Face",
                  logo: <BsEmojiSunglasses />,
                  content: (
                    <div
                      className={
                        "grid grid-cols-2 overflow-y-scroll max-h-full min-h-0"
                      }
                    >
                      {renderItems("face")}
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </section>
      </main>
    </StrictMode>
  );
}
