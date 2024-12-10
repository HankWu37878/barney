"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AddIngredientProps = {
  branchId: string;
};

export default function AddIngredient({ branchId }: AddIngredientProps) {
  const [isIngredientFormOpen, setIsIngredientFormOpen] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (isIngredientFormOpen) {
      setIsIngredientFormOpen(false);
    } else {
      setIsIngredientFormOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const data = {
      itemName: formData.get("name") as string,
      amount: Number(formData.get("quantity")),
      unit: formData.get("unit") as string,
      expireDate: formData.get("expireDate") as string,
      branchId, // Pass the branch ID from props
    };

    try {
      const res = await fetch("/api/add-ingredient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("商品新增成功！");
        router.refresh(); // Refresh the page to show updated data
      } else {
        const error = await res.json();
        alert(error.message || "新增商品失敗");
      }
    } catch (error) {
      console.error("新增商品時發生錯誤:", error);
      alert("新增商品時發生錯誤，請稍後再試");
    }
  };

  return (
    <section className="bg-white p-4 mb-6 rounded-lg shadow-lg">
      <button
        onClick={handleClick}
        className="w-full text-left flex items-center justify-between p-4 text-gray-800 font-semibold bg-indigo-100 rounded-lg hover:bg-indigo-200 transition"
      >
        <span>新增材料</span>
        <span>{isIngredientFormOpen ? "▲" : "▼"}</span>
      </button>
      {isIngredientFormOpen && (
        <div className="mt-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                材料名稱
              </label>
              <input
                type="text"
                name="name"
                placeholder="輸入材料名稱"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                單位
              </label>
              <input
                type="text"
                name="unit"
                placeholder="輸入單位"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                數量
              </label>
              <input
                type="number"
                name="quantity"
                placeholder="輸入數量"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                到期日期
              </label>
              <input
                type="date"
                name="expireDate"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
            >
              新增材料
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
