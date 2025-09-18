import type { Metadata } from "next";
import "@/styles/globals.css";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Burgerito",
  description: "Next.js + temps réeel",
  icons: "/logo.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
