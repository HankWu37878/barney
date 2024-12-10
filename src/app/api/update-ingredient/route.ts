import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { ingredientRestockTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const updateIngRestockSchema = z.object({
  branchId: z.string(),
  targetId: z.string(),
  expireDate: z.string(),
  isAdd: z.boolean(),
  amount: z.number(),
});

type updateIngRestockRequest = z.infer<typeof updateIngRestockSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();
  try {
    updateIngRestockSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { branchId, targetId, amount, isAdd, expireDate } =
    data as updateIngRestockRequest;

  try {
    const list = await db
      .select({
        amount: ingredientRestockTable.amount,
        ingredientId: ingredientRestockTable.ingredientId,
        branchId: ingredientRestockTable.branchId,
        date: ingredientRestockTable.date,
      })
      .from(ingredientRestockTable)
      .where(
        and(
          eq(ingredientRestockTable.branchId, branchId),
          eq(ingredientRestockTable.ingredientId, targetId)
        )
      )
      .orderBy(ingredientRestockTable.expireDate);
    let totalAmount = amount;

    if (isAdd) {
      await db
        .insert(ingredientRestockTable)
        .values({
          amount: amount,
          ingredientId: targetId,
          branchId: branchId,
          expireDate: expireDate,
        })
        .execute();

      return NextResponse.json(
        { msg: "Update Restock successfully!" },
        { status: 200 }
      );
    } else {
      for (let i = 0; i < list.length; i++) {
        if (totalAmount > list[i].amount) {
          totalAmount = totalAmount - list[i].amount;
          await db
            .update(ingredientRestockTable)
            .set({ amount: 0 })
            .where(
              and(
                eq(ingredientRestockTable.branchId, branchId),
                eq(ingredientRestockTable.ingredientId, targetId),
                eq(ingredientRestockTable.date, list[i].date)
              )
            )
            .execute();
        } else if (totalAmount < list[i].amount) {
          await db
            .update(ingredientRestockTable)
            .set({ amount: list[i].amount - totalAmount })
            .where(
              and(
                eq(ingredientRestockTable.branchId, branchId),
                eq(ingredientRestockTable.ingredientId, targetId),
                eq(ingredientRestockTable.date, list[i].date)
              )
            )
            .execute();
          totalAmount = totalAmount - list[i].amount;
        } else if (totalAmount < 0) {
          break;
        }
      }
      // list.forEach(async (l) => {
      //   if (totalAmount > l.amount) {
      //     totalAmount = totalAmount -  l.amount;
      //     await db
      //       .delete(itemRestockTable)
      //       .where(
      //         and(
      //           eq(itemRestockTable.branchId, branchId),
      //           eq(itemRestockTable.itemId, targetId),
      //           eq(itemRestockTable.date, l.date)
      //         )
      //       )
      //       .execute();
      //   }
      // });

      return NextResponse.json(
        { msg: "Update Restock successfully!" },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
