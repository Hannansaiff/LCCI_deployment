import type { Metadata } from "next";
import { Inter, Noto_Nastaliq_Urdu } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const urdu = Noto_Nastaliq_Urdu({
  weight: ["400", "600", "700"],
  subsets: ["arabic"],
  variable: "--font-urdu",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LCCI – Layyah Chamber of Commerce & Industry",
    template: "%s | LCCI",
  },
  description:
    "Official chamber supporting business registration, trade, training, and community welfare in Layyah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${urdu.variable} min-h-screen bg-[#F5F7FA] antialiased`}
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
