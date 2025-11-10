import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Deutsche Meisterschaften der Formationen Standard & Latein 2026",
  description:
    "Erleben Sie die Faszination des Formationstanzes bei den Deutschen Meisterschaften 2026! Seien Sie dabei, wenn die besten Teams Deutschlands in Standard und Latein um den Titel kämpfen. Ein unvergessliches Event für Tanzbegeisterte und Sportfans!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
