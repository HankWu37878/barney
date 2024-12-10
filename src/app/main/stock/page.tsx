// "use client";
// import { useEffect, useState } from "react";

import { db } from "@/db";
import {
  brandTable,
  drinkTypeTable,
  ingredientRestockTable,
  ingredientTable,
  itemRestockTable,
  itemTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { Type } from "@/lib/types";
import { eq, sql } from "drizzle-orm";
import AddIngredient from "./_components/AddIngredient";
import AddItem from "./_components/AddItem";
import TableRow from "./_components/TableRow";

export default async function Stock() {
  const session = await auth();
  const branchId = session?.user?.id;
  const itemStock = await db
    .select({
      name: itemTable.itemName,
      id: itemTable.itemId,
      quantity: sql`COALESCE(SUM(${itemRestockTable.amount}), 0)`.as<number>(
        "quantity"
      ),
    })
    .from(itemRestockTable)
    .where(eq(itemRestockTable.branchId, branchId ?? ""))
    .leftJoin(itemTable, sql`${itemRestockTable.itemId} = ${itemTable.itemId}`)
    .groupBy(itemTable.itemName, itemTable.itemId)
    .execute();

  // 查詢材料庫存
  const ingredientStock = await db
    .select({
      name: ingredientTable.ingredientName,
      id: ingredientTable.ingredientId,
      quantity:
        sql`COALESCE(SUM(${ingredientRestockTable.amount}), 0)`.as<number>(
          "quantity"
        ),
    })
    .from(ingredientRestockTable)
    .where(eq(ingredientRestockTable.branchId, branchId ?? ""))
    .leftJoin(
      ingredientTable,
      sql`${ingredientRestockTable.ingredientId} = ${ingredientTable.ingredientId}`
    )
    .groupBy(ingredientTable.ingredientName, ingredientTable.ingredientId)
    .execute();

  const drinkTypes: Type[] = await db
    .select({ id: drinkTypeTable.typeId, name: drinkTypeTable.typeName })
    .from(drinkTypeTable)
    .execute();
  const brands: Type[] = await db
    .select({ id: brandTable.brandId, name: brandTable.brandName })
    .from(brandTable)
    .execute();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <AddItem
        drinkTypes={drinkTypes}
        brands={brands}
        branchId={branchId ?? "Nah"}
      />
      <AddIngredient branchId={branchId ?? "Nah"} />

      {/* Item Stock */}
      <section className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Item Stock</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200 w-full justify-between">
              <th className="p-3 border-b w-1/3">Item</th>
              <th className="p-3 border-b w-1/3">Quantity</th>
              <th className="p-3 border-b w-1/3"></th>
            </tr>
          </thead>
          <tbody>
            {itemStock.map((item) => (
              <TableRow
                key={item.id}
                quantity={item.quantity}
                name={item.name ?? "Nah"}
                id={item.id ?? "Nah"}
                branchId={branchId ?? "Nah"}
                tag={true}
              />
            ))}
          </tbody>
        </table>
      </section>

      {/* Ingredient Stock */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Ingredient Stock</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200 justify-between w-full">
              <th className="w-1/3 border-b p-3">Ingredient</th>
              <th className="w-1/3 border-b p-3">Quantity</th>
              <th className="w-1/3 border-b p-3"></th>
            </tr>
          </thead>
          <tbody>
            {ingredientStock.map((ingredient) => (
              <TableRow
                key={ingredient.id}
                quantity={ingredient.quantity}
                name={ingredient.name ?? "Nah"}
                id={ingredient.id ?? "Nah"}
                branchId={branchId ?? "Nah"}
                tag={false}
              />
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
