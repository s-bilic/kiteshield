import React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
const Wallet = dynamic(() => import("../components/wallet"), {
  ssr: false,
});
const inter = Inter({ subsets: ["latin"] });
import { ThemeProvider } from "@/components/theme-provider";
import ClientProvider from "@/components/client-provider";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Toaster } from "@/components/ui/toaster";
import GoogleAnalytics from "@/components/googleAnalytics";

export const metadata: Metadata = {
  title: "Kiteshield",
  description: "Protect your transactions on the Solana blockchain",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleAnalytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ClientProvider session={session}>
            <Wallet>
              <div className="p-5 mx-auto w-[680px]">{children}</div>
            </Wallet>
          </ClientProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
