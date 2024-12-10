import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { itemRestockTable, itemTable } from "@/db/schema";

const AddItemSchema = z.object({
  itemName: z.string(),
  concentration: z.number(),
  typeId: z.string(),
  brandId: z.string(),
  branchId: z.string(),
  amount: z.number(),
  expireDate: z.string(),
});

type AddItemRequest = z.infer<typeof AddItemSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();
  try {
    AddItemSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const {
    brandId,
    typeId,
    amount,
    itemName,
    expireDate,
    concentration,
    branchId,
  } = data as AddItemRequest;

  try {
    const [newItem] = await db
      .insert(itemTable)
      .values({
        typeId: typeId,
        itemName: itemName,
        brandId: brandId,
        concentration: concentration,
      })
      .returning({ itemId: itemTable.itemId })
      .execute();

    await db
      .insert(itemRestockTable)
      .values({
        itemId: newItem.itemId,
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
