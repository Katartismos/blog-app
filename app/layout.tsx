import type { Metadata } from "next";
import { Archivo, Geist_Mono } from "next/font/google";
import "./globals.css";
import WhiteScreenTransition from "@/components/WhiteScreenTransition";
import ScrollToTopButton from "@/components/ScrollToTopButton";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blogify",
  description: "A modern blog platform",
  icons: {
    icon: '/rss.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${archivo.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <WhiteScreenTransition />
        {children}
        <ScrollToTopButton />
      </body>
    </html>
  );
}
