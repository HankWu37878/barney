import { db } from "@/db";
import {
  ingredientRestockTable,
  ingredientTable,
  itemRestockTable,
  itemTable,
} from "@/db/schema";
import { sql } from "drizzle-orm";

export default async function Stock() {
  // 查詢商品庫存
  const itemStock = await db
    .select({
      item: itemTable.itemName, // 商品名稱
      quantity: sql`COALESCE(SUM(${itemRestockTable.amount}), 0)`.as<number>(
        "quantity"
      ), // 聚合數量
    })
    .from(itemRestockTable)
    .leftJoin(itemTable, sql`${itemRestockTable.itemId} = ${itemTable.itemId}`)
    .groupBy(itemTable.itemName)
    .execute();

  // 查詢材料庫存
  const ingredientStock = await db
    .select({
      item: ingredientTable.ingredientName, // 材料名稱
      quantity:
        sql`COALESCE(SUM(${ingredientRestockTable.amount}), 0)`.as<number>(
          "quantity"
        ), // 聚合數量
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
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Item Stock</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border-b">Item</th>
              <th className="p-3 border-b">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {itemStock.map((item, index) => {
              const itemName = item.item || "N/A"; // 防止名稱為 null
              const quantity = item.quantity || 0; // 防止數量為 null
              return (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="p-3 border-b">{itemName}</td>
                  <td className="p-3 border-b">{quantity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* 材料庫存 */}
      <section className="bg-white p-6 rounded-lg shadow-md mt-4">
        <h2 className="text-xl font-semibold mb-4">Ingredient Stock</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border-b">Ingredient</th>
              <th className="p-3 border-b">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {ingredientStock.map((ingredient, index) => {
              const ingredientName = ingredient.item || "N/A"; // 防止名稱為 null
              const quantity = ingredient.quantity || 0; // 防止數量為 null
              return (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="p-3 border-b">{ingredientName}</td>
                  <td className="p-3 border-b">{quantity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
