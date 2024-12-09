import NextAuth from "next-auth";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { adminTable } from "@/db/schema";

import CredentialsProvider from "./CredentialsProvider";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [CredentialsProvider],
  callbacks: {
    async session({ session, token }) {
      const name = token.name || session?.user?.name;
      if (!name) return session;

      const [admin] = await db
        .select({
          id: adminTable.adminId,
          branchId: adminTable.branchId,
        })
        .from(adminTable)
        .where(eq(adminTable.adminName, name))
        .execute();

      console.log(admin.branchId)

      return {
        ...session,
        user: {
          ...session.user,
          id: admin.branchId,
        },
      };
    },
    async jwt({ token, account }) {
      if (!account) return token;
      const { name } = token;
      if  (!name)  return token;


      const [existedUser] = await db
        .select({
          id: adminTable.adminId,
        })
        .from(adminTable)
        .where(eq(adminTable.adminName, name))
        .execute();

    //   if (existedUser) return token;

    //   await db.insert(adminTable).values({
    //     adminName: name,
    //     branchId: "",
    //   });

       return token;
    },
  },
  pages: {
    signIn: "/",
  },
});