import { StrictMode, useEffect, useState } from "react";
import {
  UserShop,
  SelectedItems,
  ItemDisplay,
} from "../../../../../app-shared/types";
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
import { ShopCategory } from "./ShopCategory";
import { GiCoins } from "react-icons/gi";
import { ShopPreview } from "./ShopPreview";
import { CosmeticAssets } from "../../../game/configs/assets-config";
import { Assets } from "@pixi/assets";
import LoadingPage from "../../LoadingPage";

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
  const [cosmeticsAssets, setCosmeticsAssets] = useState<CosmeticAssets | null>(
    null
  );
  const [serverSelectedItems, setServerSelectedItems] =
    useState<SelectedItems | null>(null);
  const [grayedOut, setGrayedOut] = useState<boolean>(true);
  const [previewItem, setPreviewItem] = useState<SelectedItems | null>(null);
  const [payingSkin, setPayingSkin] = useState<number>(0);

  let loaded: boolean = false;

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
    async function loadAssets() {
      const cosmetics = await Assets.get("cosmetics");
      if (!cosmetics) {
        setCosmeticsAssets(await Assets.loadBundle("cosmetics"));
      } else {
        setCosmeticsAssets(cosmetics);
      }
    }
    load();
    loadAssets();
  }, []);

  useEffect(() => {
    if (serverSelectedItems && previewItem) {
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

      if (
        (previewItem.faceID === serverSelectedItems.faceID &&
          previewItem.hatID === serverSelectedItems.hatID &&
          previewItem.skinID === serverSelectedItems.skinID) ||
        (shopData && shopData.coins - payingSkinPrice < 0)
      ) {
        setGrayedOut(true);
      } else {
        setGrayedOut(false);
      }
    }
  }, [shopData, serverSelectedItems, previewItem]);

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

  function getItemsFromCategory(category: string): ItemDisplay[] {
    const itemSet = new Set(shopData?.items);
    const selectedItems = shopData?.selectedItems;
    const categoryItems = SHOP_ITEMS.filter(
      (item) => item.category === category
    );
    return categoryItems.map((item) => {
      return {
        ...item,
        owned: itemSet.has(item.id),
        selected:
          selectedItems?.skinID === item.id ||
          selectedItems?.hatID === item.id ||
          selectedItems?.faceID === item.id,
        previewed:
          previewItem?.skinID === item.id ||
          previewItem?.hatID === item.id ||
          previewItem?.faceID === item.id,
        ableToBuy:
          shopData !== undefined &&
          shopData !== null &&
          shopData.coins - item.price >= 0,
        cosmetics: cosmeticsAssets,
        tryBuy: tryBuy,
        trySelect: trySelect,
        tryPreview: tryPreview,
      };
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

  if (!shopData || !cosmeticsAssets) return <LoadingPage />;

  return (
    <main className={"h-full flex flex-col min-h-0 grow"}>
      <section
        className={
          "grid grid-cols-1 sm:grid-cols-2 h-full min-h-0 pt-2 border-y-2 border-t-blue-500/50 border-b-gray-600/40 backdrop-blur-sm bg-slate-600/30"
        }
      >
        <div className={"flex flex-col max-h-full min-h-0 mt-3"}>
          <div
            className={
              "flex sm:justify-start justify-center sm:mb-3 mb-0 max-h-full"
            }
          >
            <div
              className={
                "flex font-black sm:text-5xl text-3xl sm:border-2 border rounded-md sm:px-4 sm:pt-4 sm:pb-1 sm:mt-2 sm:ml-6 px-2 pt-1 min-h-0 h-fit"
              }
            >
              {shopData?.coins} <GiCoins className="ml-2 sm:pb-2" />
            </div>
          </div>

          <div
            className={
              "flex sm:flex-col flex-row-reverse justify-center min-h-0 max-h-full overflow-y-auto"
            }
          >
            <div className={"flex justify-center min-h-0"}>
              <ShopPreview
                initWidth={300}
                initHeight={450}
                selectedItems={
                  previewItem === null
                    ? { skinID: -1, hatID: -2, faceID: -3 }
                    : previewItem
                }
                cosmeticsAssets={cosmeticsAssets}
              />
            </div>
            <div
              className={
                "flex sm:justify-center sm:align-middle sm:my-auto lg:my-auto min-h-0 max-h-full"
              }
            >
              <AppButton
                className={
                  "text-sm sm:text-2xl h-fit sm:w-60 w-32 my-auto mx-4"
                }
                color={"regular"}
                onClick={selectCharacterServer}
                grayedOut={grayedOut}
              >
                Choose character {renderPayingSkin()}
              </AppButton>
            </div>
          </div>
        </div>
        <div className={"h-full min-h-0"}>
          <Tabs
            tabsDatas={[
              {
                title: "Skin",
                logo: <AiFillSkin />,
                content: <ShopCategory items={getItemsFromCategory("skin")} />,
              },
              {
                title: "Hat",
                logo: <FaHatCowboy />,
                content: <ShopCategory items={getItemsFromCategory("hat")} />,
              },
              {
                title: "Face",
                logo: <BsEmojiSunglasses />,
                content: <ShopCategory items={getItemsFromCategory("face")} />,
              },
            ]}
          />
        </div>
      </section>
    </main>
  );
}
