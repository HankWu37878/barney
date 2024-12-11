import { db } from "@/db";
import {
  customizedOrderTable,
  memberAccountTable,
  orderTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { Order } from "@/lib/types";
import { eq } from "drizzle-orm";
import { OrderTable } from "./_components/OrderTable";

export default async function Main() {
  const session = await auth();
  const branchId = session?.user?.id;
  const orders: Order[] = await db
    .select({
      type: orderTable.type,
      lname: memberAccountTable.lname,
      fname: memberAccountTable.fname,
      time: orderTable.time,
      phone: memberAccountTable.memberPhone,
      orderId: orderTable.orderId,
    })
    .from(orderTable)
    .where(eq(orderTable.branchId, branchId ?? ""))
    .leftJoin(
      memberAccountTable,
      eq(orderTable.memberId, memberAccountTable.memberId)
    )
    .orderBy(orderTable.time)
    .execute();

  const customOrders: Order[] = await db
    .select({
      type: customizedOrderTable.type,
      lname: memberAccountTable.lname,
      fname: memberAccountTable.fname,
      time: customizedOrderTable.time,
      phone: memberAccountTable.memberPhone,
      orderId: customizedOrderTable.customizedOrderId,
    })
    .from(customizedOrderTable)
    .where(eq(customizedOrderTable.branchId, branchId ?? ""))
    .leftJoin(
      memberAccountTable,
      eq(customizedOrderTable.memberId, memberAccountTable.memberId)
    )
    .orderBy(customizedOrderTable.time)
    .execute();
  const today = new Date();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <OrderTable
        isCustom={false}
        orders={orders.filter(
          (o) =>
            o.time.getUTCDate() === today.getDate() &&
            o.time.getUTCMonth() === today.getMonth() &&
            o.time.getUTCFullYear() === today.getFullYear()
        )}
      />
      <OrderTable
        isCustom={true}
        orders={customOrders.filter(
          (o) =>
            o.time.getUTCDate() === today.getDate() &&
            o.time.getUTCMonth() === today.getMonth() &&
            o.time.getUTCFullYear() === today.getFullYear()
        )}
      />
    </div>
  );
}
