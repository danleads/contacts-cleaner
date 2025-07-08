import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sedna Contacts Cleaner",
  description: "Maintain a single source of truth for your contacts by cleaning duplicates and fixing invalid emails",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
