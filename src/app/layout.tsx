import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-Urbanist",
  subsets: ["latin"],
  display: "swap",
});



export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`   ${urbanist.variable}  antialiased`}
      >
        {children}
      </body>
    </html>
  );
}