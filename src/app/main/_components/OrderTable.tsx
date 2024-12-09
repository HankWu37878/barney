"use client"
import { Order } from "@/lib/types"
import { useState } from "react";

export type OrderTableProps = {
    orders: Order[];
}

export function OrderTable({orders}: OrderTableProps) {
      const [filter, setFilter] = useState("All");
    
      // Filter orders based on type
      const filteredOrders =
        filter === "All" ? orders : orders.filter((order) => order.type === filter);
    return(
        <section className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Today's Orders</h2>
        <div className="mb-4">
          <label htmlFor="filter" className="font-medium mr-2">
            Filter:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="All">All</option>
            <option value="Dine-In">Dine-In</option>
            <option value="Takeaway">Takeaway</option>
            <option value="Delivery">Delivery</option>
          </select>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border-b">Time</th>
              <th className="p-3 border-b">Customer</th>
              <th className="p-3 border-b">Phone</th>
              <th className="p-3 border-b">Type</th>
              <th className="p-3 border-b">Content</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.orderId} className="hover:bg-gray-100">
                <td className="p-3 border-b">{String(order.time.toLocaleTimeString())}</td>
                <td className="p-3 border-b">{order.fname + " " + order.lname}</td>
                <td className="p-3 border-b">{order.phone}</td>
                <td className="p-3 border-b">{order.type}</td>
                <td className="p-3 border-b">{order.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    )
}