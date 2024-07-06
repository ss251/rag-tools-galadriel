import "./globals.css";
import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { Syne } from "next/font/google";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "galadriel rag-tools ui",
  description: "ui for running galadriel rag tools",
};

const fontHeading = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const fontBody = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn("antialiased", fontHeading.variable, fontBody.variable)}
      >
        {children}
      </body>
    </html>
  );
}
