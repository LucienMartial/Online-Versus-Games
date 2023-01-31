import { StrictMode, useEffect, useState } from "react";
import { ShopItem } from "../ShopItem";
import { UserShop, SelectedItems } from "../../../../../app-shared/types";
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

  useEffect(() => {
    if (!shopData) return;
    if (serverSelectedItems) {
      if (
        shopData.selectedItems.faceID === serverSelectedItems.faceID &&
        shopData.selectedItems.hatID === serverSelectedItems.hatID &&
        shopData.selectedItems.skinID === serverSelectedItems.skinID
      ) {
        setGrayedOut(true);
      } else {
        setGrayedOut(false);
      }
    }
  }, [shopData]);

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
    if (!shopData) return false;
    let res = null;
    if (replacedItems === null) {
      res = await selectJsonPostRequest(shopData.selectedItems);
    } else {
      res = await selectJsonPostRequest(replacedItems);
    }
    if (res === null) return false;
    if (res.status === 200) {
      replacedItems
        ? setServerSelectedItems(replacedItems)
        : setServerSelectedItems(shopData.selectedItems);
      setGrayedOut(true);
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
  }

  async function tryBuyServer(id: number): Promise<boolean> {
    if (!shopData) return false;
    const res = await fetch("/api/shop-buy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId: id } satisfies ItemTarget),
    });
    if (res.status === 200) {
      const replacedItems = replaceSelectedItem(id, shopData.selectedItems);
      const resSelectCharacter = await selectCharacterServer(replacedItems);
      if (resSelectCharacter) {
        setShopData({
          ...shopData,
          selectedItems: replaceSelectedItem(id, shopData.selectedItems),
        });
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

  function renderItems(category: string) {
    const itemSet = new Set(shopData?.items);
    const selectedItems = shopData?.selectedItems;
    return SHOP_ITEMS.map((item) => {
      const owned = itemSet.has(item.id);
      const selected =
        selectedItems?.skinID === item.id ||
        selectedItems?.hatID === item.id ||
        selectedItems?.faceID === item.id;
      return item.category === category ? (
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
        <section className={"grid grid-cols-1 sm:grid-cols-2 h-full"}>
          <div className={"grid grid-rows-2 h-full"}>
            <div>HERE WILL APEAR THE SKIN PREVIEW</div>
            <div>
              <AppButton
                className={"col-span-3"}
                color={"regular"}
                onClick={selectCharacterServer}
                grayedOut={grayedOut}
              >
                Select character
              </AppButton>
            </div>
          </div>
          <div className={""}>
            <Tabs
              tabsDatas={[
                {
                  title: "Skin",
                  logo: <AiFillSkin />,
                  content: (
                    <div className={"grid grid-cols-2 h-full"}>
                      {renderItems("skin")}
                    </div>
                  ),
                },
                {
                  title: "Hat",
                  logo: <FaHatCowboy />,
                  content: renderItems("hat"),
                },
                {
                  title: "Face",
                  logo: <BsEmojiSunglasses />,
                  content: renderItems("face"),
                },
              ]}
            />
          </div>
        </section>
      </main>
    </StrictMode>
  );
}
