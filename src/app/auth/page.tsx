import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";

import AuthForm from "./_components/AuthForm";

export default async function AuthPage() {
  const session = await auth();
  // const admins = await db.select().from(adminTable);

  if (session?.user?.id) {
    redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}`);
  }

  return (
    <>
      <div className="bg-zinc-700 justify-center min-h-screen w-screen items-center flex flex-col">
        <div className="flex justify-center items-center">
          <div className="bg-white shadow-md lg:w-1/3 w-1/2 max-w-3xl flex justify-center py-4 lg:py-6 items-center fixed top-8 lg:top-12 rounded-lg">
            <h1 className="text-lg lg:text-2xl">BARNEY 後台管理系統</h1>
          </div>
        </div>
        <div className="flex justify-center w-full items-center shadow-md">
          <AuthForm />
        </div>
      </div>
    </>
  );
}
