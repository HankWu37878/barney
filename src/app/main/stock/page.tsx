import { db } from "@/db";
import {
  ingredientRestockTable,
  ingredientTable,
  itemRestockTable,
  itemTable,
} from "@/db/schema";
import { sql } from "drizzle-orm";

// 通用處理函數，用於處理庫存的增減
async function handleFormSubmission(
  operation: string,
  name: string,
  type: "item" | "ingredient"
) {
  const change = operation === "increment" ? 1 : -1;

  // 根據類型選擇對應的表和欄位
  const restockTable =
    type === "item" ? itemRestockTable : ingredientRestockTable;
  const mainTable = type === "item" ? itemTable : ingredientTable;
  const idColumn = type === "item" ? "itemId" : "ingredientId";
  const nameColumn =
    type === "item" ? itemTable.itemName : ingredientTable.ingredientName;

  // 獲取當前數量
  const currentQuantity = await db
    .select({
      quantity: sql`COALESCE(SUM(${restockTable.amount}), 0)`.as<number>(
        "quantity"
      ),
    })
    .from(restockTable)
    .leftJoin(
      mainTable,
      sql`${restockTable[idColumn as keyof typeof restockTable]} = ${
        mainTable[idColumn as keyof typeof mainTable]
      }`
    )
    .where(sql`${nameColumn} = ${name}`)
    .execute()
    .then((result) => (result.length > 0 ? result[0].quantity : 0));

  if (operation === "decrement" && currentQuantity <= 0) {
    throw new Error(`Cannot decrement ${type} "${name}" below 0.`);
  }

  // 更新數據庫
  await db
    .update(restockTable)
    .set({
      amount: sql`${restockTable.amount} + ${change}`,
    })
    .where(
      sql`${restockTable[idColumn as keyof typeof restockTable]} IN (
        SELECT ${mainTable[idColumn as keyof typeof mainTable]}
        FROM ${mainTable}
        WHERE ${nameColumn} = ${name}
      )`
    )
    .execute();
}

export default async function Stock({ searchParams }: { searchParams: any }) {
  if (searchParams && searchParams.action) {
    const action = searchParams.action;
    const formData = new URLSearchParams(action);
    const operation = formData.get("operation");
    const name = formData.get("name");
    const type = formData.get("type");

    if (operation && name && type) {
      await handleFormSubmission(
        operation,
        name,
        type as "item" | "ingredient"
      );
    }
  }

  // 查詢商品庫存
  const itemStock = await db
    .select({
      item: itemTable.itemName,
      quantity: sql`COALESCE(SUM(${itemRestockTable.amount}), 0)`.as<number>(
        "quantity"
      ),
    })
    .from(itemRestockTable)
    .leftJoin(itemTable, sql`${itemRestockTable.itemId} = ${itemTable.itemId}`)
    .groupBy(itemTable.itemName)
    .execute();

  // 查詢材料庫存
  const ingredientStock = await db
    .select({
      ingredient: ingredientTable.ingredientName,
      quantity:
        sql`COALESCE(SUM(${ingredientRestockTable.amount}), 0)`.as<number>(
          "quantity"
        ),
    })
    .from(ingredientRestockTable)
    .leftJoin(
      ingredientTable,
      sql`${ingredientRestockTable.ingredientId} = ${ingredientTable.ingredientId}`
    )
    .groupBy(ingredientTable.ingredientName)
    .execute();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* 商品庫存 */}
      <section className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Item Stock</h2>
        <form method="GET">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border-b">Item</th>
                <th className="p-3 border-b">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {itemStock.map((item, index) => {
                const itemName = item.item || "N/A";
                const quantity = item.quantity || 0;

                return (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="p-3 border-b">{itemName}</td>
                    <td className="p-3 border-b">
                      <button
                        type="submit"
                        name="action"
                        value={`operation=decrement&name=${itemName}&type=item`}
                        className="px-3 py-1 bg-red-500 text-white rounded m-4"
                      >
                        -
                      </button>
                      {quantity}
                      <button
                        type="submit"
                        name="action"
                        value={`operation=increment&name=${itemName}&type=item`}
                        className="px-3 py-1 bg-green-500 text-white rounded m-4"
                      >
                        +
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </form>
      </section>

      {/* 材料庫存 */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Ingredient Stock</h2>
        <form method="GET">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border-b">Ingredient</th>
                <th className="p-3 border-b">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {ingredientStock.map((ingredient, index) => {
                const ingredientName = ingredient.ingredient || "N/A";
                const quantity = ingredient.quantity || 0;

                return (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="p-3 border-b">{ingredientName}</td>
                    <td className="p-3 border-b">
                      <button
                        type="submit"
                        name="action"
                        value={`operation=decrement&name=${ingredientName}&type=ingredient`}
                        className="px-3 py-1 bg-red-500 text-white rounded m-4"
                      >
                        -
                      </button>
                      {quantity}
                      <button
                        type="submit"
                        name="action"
                        value={`operation=increment&name=${ingredientName}&type=ingredient`}
                        className="px-3 py-1 bg-green-500 text-white rounded m-4"
                      >
                        +
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </form>
      </section>
    </div>
  );
}
