import type { Metadata } from "next";
import { Archivo, Geist_Mono } from "next/font/google";
import "./globals.css";
import WhiteScreenTransition from "@/components/WhiteScreenTransition";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import SessionWrapper from "@/components/SessionWrapper";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "K-Blog",
  description: "A modern blog platform",
  icons: {
    icon: '/newspaper.svg',
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
        <SessionWrapper>
          <WhiteScreenTransition />
          {children}
          <ScrollToTopButton />
        </SessionWrapper>
      </body>
    </html>
  );
}
