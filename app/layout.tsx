import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "أرشيف الوثائق والتشريعات الوطنية | بوابة البحث الأرشيفي",
  description: "البوابة الرقمية الموحدة للأرشيف والجريدة الرسمية والوثائق الرسمية والتشريعات",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-cairo)] bg-[#F5F7FA] text-[#1F2630]">
        {children}
      </body>
    </html>
  );
}
