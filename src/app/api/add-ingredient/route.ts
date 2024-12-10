import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { ingredientRestockTable, ingredientTable } from "@/db/schema";

const AddIngredientSchema = z.object({
  itemName: z.string(),
  branchId: z.string(),
  amount: z.number(),
  unit: z.string(),
  expireDate: z.string(),
});

type AddIngredientRequest = z.infer<typeof AddIngredientSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();
  try {
    AddIngredientSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { amount, itemName, expireDate, branchId, unit } =
    data as AddIngredientRequest;

  try {
    const [newIngredient] = await db
      .insert(ingredientTable)
      .values({
        ingredientName: itemName,
        unit: unit,
      })
      .returning({ ingredientId: ingredientTable.ingredientId })
      .execute();

    await db
      .insert(ingredientRestockTable)
      .values({
        ingredientId: newIngredient.ingredientId,
        expireDate: expireDate,
        amount: amount,
        branchId: branchId,
      })
      .execute();

    return NextResponse.json(
      { msg: "Add Item successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
