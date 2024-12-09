"use client"
import { useState } from "react";

export default function Reservation() {
  const [reservations, setReservations] = useState([
    { id: 1, type: "Dine In", customer: "Alice", time: "12:00 PM" },
    { id: 2, type: "Take Out", customer: "Bob", time: "1:00 PM" },
    { id: 3, type: "Delivery", customer: "Charlie", time: "2:00 PM" },
  ]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <section className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Today's Reservation</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border-b">Time</th>
              <th className="p-3 border-b">Customer</th>
              <th className="p-3 border-b">Phone</th>
              <th className="p-3 border-b">Reservation ID</th>
              <th className="p-3 border-b">People</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((order) => (
              <tr key={order.id} className="hover:bg-gray-100">
                <td className="p-3 border-b">{order.id}</td>
                <td className="p-3 border-b">{order.type}</td>
                <td className="p-3 border-b">{order.customer}</td>
                <td className="p-3 border-b">{order.time}</td>
                <td className="p-3 border-b">{order.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
