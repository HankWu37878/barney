"use client";
import { publicEnv } from "@/lib/env/public";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SignOutButton from "./SignOutButton";

export default function Header() {
    const router = useRouter();
    const [tabSelect, setTabSelect] = useState(1);
    const gotoOrder = () => {
        setTabSelect(1);
        router.push(`${publicEnv.NEXT_PUBLIC_BASE_URL}/main`)
    }
    const gotoReservation = () => {
        setTabSelect(2);
        router.push(`${publicEnv.NEXT_PUBLIC_BASE_URL}/main/reservation`)
    }
    const gotoStock = () => {
        setTabSelect(3);
        router.push(`${publicEnv.NEXT_PUBLIC_BASE_URL}/main/stock`)
    }
    const gotoBranch = () => {
        setTabSelect(4);
        router.push(`${publicEnv.NEXT_PUBLIC_BASE_URL}/main/branch`)
    }
    return (
        <div className="w-full flex flex-col">
             <div className="w-full flex bg-zinc-700 justify-between">
                <button className="flex mx-4" onClick={gotoOrder}>
                    <h1 className="py-6 text-2xl text-white">Barney</h1>
                    <h1 className="py-6 ml-2 text-2xl text-white">後台管理系統</h1>
                </button>
                <SignOutButton/>
            </div>
            <div className="w-full flex">
                <button className={cn("px-8 py-2 hover:bg-gray-100", tabSelect === 1 && "border-b-2 border-black")} onClick={gotoOrder}>Order</button>
                <button className={cn("px-8 py-2 hover:bg-gray-100", tabSelect === 2 && "border-b-2 border-black")} onClick={gotoReservation}>Reservation</button>
                <button className={cn("px-8 py-2 hover:bg-gray-100", tabSelect === 3 && "border-b-2 border-black")} onClick={gotoStock}>Stock</button>
                <button className={cn("px-8 py-2 hover:bg-gray-100", tabSelect === 4 && "border-b-2 border-black")} onClick={gotoBranch}>Branch</button>
            </div>
        </div>
    )
  const router = useRouter();
  const [tabSelect, setTabSelect] = useState(1);
  const gotoOrder = () => {
    setTabSelect(1);
    router.push(`${publicEnv.NEXT_PUBLIC_BASE_URL}/main`);
  };
  const gotoReservation = () => {
    setTabSelect(2);
    router.push(`${publicEnv.NEXT_PUBLIC_BASE_URL}/main/reservation`);
  };
  const gotoStock = () => {
    setTabSelect(3);
    router.push(`${publicEnv.NEXT_PUBLIC_BASE_URL}/main/stock`);
  };
  const gotoBranch = () => {
    setTabSelect(4);
    router.push(`${publicEnv.NEXT_PUBLIC_BASE_URL}/main/branch`);
  };
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex bg-zinc-700">
        <button className="flex mx-4" onClick={gotoOrder}>
          <h1 className="py-6 text-2xl text-white">BARNEY</h1>
          <h1 className="py-6 ml-2 text-2xl text-white">後台管理系統</h1>
        </button>
      </div>
      <div className="w-full flex">
        <button
          className={cn(
            "px-8 py-2 hover:bg-gray-100",
            tabSelect === 1 && "border-b-2 border-black"
          )}
          onClick={gotoOrder}
        >
          Order
        </button>
        <button
          className={cn(
            "px-8 py-2 hover:bg-gray-100",
            tabSelect === 2 && "border-b-2 border-black"
          )}
          onClick={gotoReservation}
        >
          Reservation
        </button>
        <button
          className={cn(
            "px-8 py-2 hover:bg-gray-100",
            tabSelect === 3 && "border-b-2 border-black"
          )}
          onClick={gotoStock}
        >
          Stock
        </button>
        <button
          className={cn(
            "px-8 py-2 hover:bg-gray-100",
            tabSelect === 4 && "border-b-2 border-black"
          )}
          onClick={gotoBranch}
        >
          Branch
        </button>
      </div>
    </div>
  );
}
