import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { adminTable } from "@/db/schema";

const authSchema = z.object({
  name: z.string().min(1).max(100),
  password: z.string().min(8),
});

export default CredentialsProvider({
  name: "credentials",
  credentials: {
    name: { label: "Name", type: "text" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    let validatedCredentials: {
      name: string;
      password: string;
    };

    try {
      validatedCredentials = authSchema.parse(credentials);
    } catch (error) {
      return null;
    }
    const { password } = validatedCredentials;

    const [existedAdmin] = await db
      .select({
        id: adminTable.adminId,
        name: adminTable.adminName,
        branch: adminTable.branchId,
        hashedPassword: adminTable.password,
      })
      .from(adminTable)
      .where(eq(adminTable.adminName, validatedCredentials.name))
      .execute();

      // if (!existedAdmin) {
      //   if (!name) {
      //     console.log("Name is required.");
      //     return null;
      //   }
      //   const hashedPassword = await bcrypt.hash(password, 10); 
  
      //   const [createdAdmin] = await db
      //     .insert(adminTable)
      //     .values({
      //       adminName: name.toLowerCase(),
      //       password: hashedPassword,
      //     })
      //     .returning();
      //   return {
      //     name: createdUser.name,
      //     id: createdUser.displayId,
      //   };
      // }

    const isValid = await bcrypt.compare(password, existedAdmin?.hashedPassword ?? "");

    if (!isValid) {
      console.log("Wrong password. Try again.");
      return null;
    }
    return {
      name: existedAdmin.name,
      id: existedAdmin.id,
    };
  },
});