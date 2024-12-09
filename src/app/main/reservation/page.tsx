import { db } from "@/db";
import { branchTable, memberAccountTable, reserveTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq, sql } from "drizzle-orm";

export default async function Reservation() {
  const session = await auth(); // 驗證使用者身份
  const branchId = session?.user?.id; // 獲取當前分店 ID

  // 查詢當天預約的資料
  const reservations = await db
    .select({
      id: reserveTable.branchId, // 預約 ID
      customer:
        sql`CONCAT(${memberAccountTable.lname}, ' ', ${memberAccountTable.fname})`.as(
          "customer"
        ), // 客戶名稱
      phone: memberAccountTable.memberPhone, // 客戶電話
      time: reserveTable.time, // 預約時間
      people: reserveTable.people, // 預約人數
    })
    .from(reserveTable)
    .leftJoin(
      memberAccountTable,
      eq(reserveTable.memberId, memberAccountTable.memberId)
    ) // 聯結會員資料
    .leftJoin(branchTable, eq(reserveTable.branchId, branchTable.branchId)) // 聯結分店資料
    .where(
      and(
        eq(reserveTable.branchId, branchId ?? ""), // 限制分店 ID
        sql`DATE(${reserveTable.time}) = CURRENT_DATE` // 限制為今天的預約
      )
    )
    .orderBy(reserveTable.time) // 按時間排序
    .execute();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <section className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Today's Reservations</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border-b">Id</th>
              <th className="p-3 border-b">Customer</th>
              <th className="p-3 border-b">Phone</th>
              <th className="p-3 border-b">Time</th>
              <th className="p-3 border-b">People</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => {
              const customer =
                typeof reservation.customer === "string"
                  ? reservation.customer
                  : "Unknown";
              const phone = reservation.phone || "N/A";
              const time = reservation.time
                ? reservation.time.toLocaleString()
                : "N/A";
              const people =
                reservation.people !== null ? reservation.people : "N/A";

              return (
                <tr key={reservation.id} className="hover:bg-gray-100">
                  <td className="p-3 border-b">{reservation.id}</td>
                  <td className="p-3 border-b">{customer}</td>
                  <td className="p-3 border-b">{phone}</td>
                  <td className="p-3 border-b">{time}</td>
                  <td className="p-3 border-b">{people}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
