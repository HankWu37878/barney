import { db } from "@/db";
import { branchTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export default async function Branch() {
  const session = await auth();
  const branchId = session?.user?.id;
  console.log(branchId);
  
  const [branchInfo] = await db.select({
    address: branchTable.address,
    phone: branchTable.branchPhone,
    seats: branchTable.seatNumber,
  }).from(branchTable).where(eq(branchTable.branchId, branchId ?? "")).execute();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Branch Information</h2>
        <h1>Branch Address: {branchInfo.address}</h1>
        <h1>Branch Phone: {branchInfo.phone}</h1>
        <h1>Seats: {branchInfo.seats}</h1>
      </section>
    </div>
  );
}
