"use client";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type RestockDialogprops = {
  open: boolean;
  onClose: () => void;
  branchId: string;
  targetId: string;
  targetName: string;
  isAdd: boolean;
  tag: boolean;
};

export default function RestockDialog({
  open,
  onClose,
  branchId,
  targetId,
  targetName,
  isAdd,
  tag,
}: RestockDialogprops) {
  const [amount, setAmount] = useState<number>(0);
  const [expireDate, setExpireDate] = useState<string>("");

  const router = useRouter();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (amount === 0) {
      alert("Please fill in the amount！");
      return;
    }

    if (isAdd && expireDate === "") {
      alert("Please fill in the expire date！");
      return;
    }

    try {
      const res = await fetch(
        tag ? "/api/update-stock" : "/api/update-ingredient",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            branchId,
            targetId,
            expireDate,
            isAdd,
            amount,
          }),
        }
      );

      if (res.ok) {
        alert("Restock update successfully!");
        router.push("/main/stock");
      } else {
        const error = await res.json();
        alert(error.msg || "Failed to update restock");
      }
    } catch (error) {
      console.error("Error updating restock:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="text-center text-xl mt-4 font-semibold">
        Restock Submit
      </DialogTitle>
      <DialogContent>
        <div className="flex-col space-y-8 px-16 py-4 font-normal">
          <p className="text-xl">Restock Name： {targetName}</p>

          <div className="w-full flex text-black placeholder-gray-30 rounded-md items-center gap-5">
            <p className="text-xl">{isAdd ? "Add" : "Deduct"} Amount:</p>
            <input
              type="number"
              className="w-1/2 rounded-md overflow-scroll text-xl p-2 text-black placeholder-gray-500"
              placeholder=""
              value={amount}
              onChange={(e) => setAmount(e.target.valueAsNumber)}
            />
          </div>

          {isAdd && (
            <div className="w-full flex text-black placeholder-gray-30 rounded-md items-center gap-5">
              <p className="text-xl">Expire Date:</p>
              <input
                type="date"
                className="w-1/2 rounded-md overflow-scroll text-xl p-2 text-black placeholder-gray-500"
                placeholder=""
                value={expireDate}
                onChange={(e) => setExpireDate(e.target.value)}
              />
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <div className="w-full h-full flex justify-center">
          <div className="flex gap-4 py-12">
            <button
              className="w-full px-12 py-4 rounded-md font-medium text-white bg-gray-300 hover:bg-gray-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="w-full py-4 px-12 rounded-md font-medium text-black bg-[#FFE900] hover:bg-yellow-400"
              onClick={(e) => handleSubmit(e)}
            >
              Confirm
            </button>
          </div>
        </div>
      </DialogActions>
    </Dialog>
  );
}
