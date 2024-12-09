"use client"
import { useState } from "react";

export default function Stock() {
  const [stock, setStock] = useState([
    { id: 1, item: "Burger", quantity: 20 },
    { id: 2, item: "Pizza", quantity: 15 },
    { id: 3, item: "Soda", quantity: 30 },
  ]);



  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Item Stock</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border-b">Item</th>
              <th className="p-3 border-b">Quantity</th>
              <th className="p-3 border-b">Detail</th>
            </tr>
          </thead>
          <tbody>
            {stock.map((item) => (
              <tr key={item.id} className="hover:bg-gray-100">
                <td className="p-3 border-b">{item.item}</td>
                <td className="p-3 border-b">{item.quantity}</td>
                <td className="p-3 border-b">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="bg-white p-6 rounded-lg shadow-md mt-4">
        <h2 className="text-xl font-semibold mb-4">Ingredient Stock</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border-b">Ingredient</th>
              <th className="p-3 border-b">Quantity</th>
              <th className="p-3 border-b">Detail</th>
            </tr>
          </thead>
          <tbody>
            {stock.map((item) => (
              <tr key={item.id} className="hover:bg-gray-100">
                <td className="p-3 border-b">{item.item}</td>
                <td className="p-3 border-b">{item.quantity}</td>
                <td className="p-3 border-b">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
