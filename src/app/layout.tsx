import { Noto_Sans } from "next/font/google";
import "./globals.css";

import { SessionProvider } from "next-auth/react";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

const noto = Noto_Sans({
  subsets: ["latin-ext"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "BARNEY",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={noto.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
