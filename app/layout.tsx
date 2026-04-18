import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Space_Grotesk } from "next/font/google";
import Shell from "@/src/components/layout/Shell";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-headline",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-label",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dimas Febriyanto - Software Engineer",
  description: "Building scalable applications with precision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${inter.variable} ${spaceGrotesk.variable} min-h-screen relative`}
        suppressHydrationWarning={true}
      >
        {/* Ambient Background */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] mix-blend-multiply opacity-70 translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] mix-blend-multiply opacity-50 -translate-x-1/3 translate-y-1/3"></div>
        </div>
        <Shell>
          {children}
        </Shell>
      </body>
    </html>
  );
}
