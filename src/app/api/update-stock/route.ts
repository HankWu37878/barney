import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { itemRestockTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const updateRestockSchema = z.object({
  branchId: z.string(),
  targetId: z.string(),
  expireDate: z.string(),
  isAdd: z.boolean(),
  amount: z.number(),
});

type updateRestockRequest = z.infer<typeof updateRestockSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();
  try {
    updateRestockSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { branchId, targetId, amount, isAdd, expireDate } =
    data as updateRestockRequest;

  try {
    const list = await db
      .select({
        amount: itemRestockTable.amount,
        itemId: itemRestockTable.itemId,
        branchId: itemRestockTable.branchId,
        date: itemRestockTable.date,
      })
      .from(itemRestockTable)
      .where(
        and(
          eq(itemRestockTable.branchId, branchId),
          eq(itemRestockTable.itemId, targetId)
        )
      )
      .orderBy(itemRestockTable.expireDate);
    let totalAmount = amount;

    if (isAdd) {
      await db
        .insert(itemRestockTable)
        .values({
          amount: amount,
          itemId: targetId,
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
            .update(itemRestockTable)
            .set({ amount: 0 })
            .where(
              and(
                eq(itemRestockTable.branchId, branchId),
                eq(itemRestockTable.itemId, targetId),
                eq(itemRestockTable.date, list[i].date)
              )
            )
            .execute();
        } else if (totalAmount < list[i].amount) {
          await db
            .update(itemRestockTable)
            .set({ amount: list[i].amount - totalAmount })
            .where(
              and(
                eq(itemRestockTable.branchId, branchId),
                eq(itemRestockTable.itemId, targetId),
                eq(itemRestockTable.date, list[i].date)
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
