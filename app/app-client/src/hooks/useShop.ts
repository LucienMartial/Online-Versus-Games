import { Item } from "../../../app-shared/types";

// function getItems(): Item[] {
//   // dont forget to ask the server for the list of items

//   return [
//     { id: 1, name: "Test item 1", price: 1, color: undefined },
//     { id: 2, name: "Test item 2", price: 1, color: undefined },
//     { id: 3, name: "Test item 3", price: 1, color: undefined },
//     { id: 4, name: "Test item 4", price: 1, color: undefined },
//   ];
// }

// TODO :  get rid of this dead code

function useShop() {
  //   const items: Item[] = getItems();

  async function tryBuyServer(id: number): Promise<Item | null> {
    const res = await fetch("/api/shop-buy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    if (res.status === 200) {
      return res.json().then((data: Item) => {
        return data;
      });
    }
    return null;
  }
}

export { useShop };
