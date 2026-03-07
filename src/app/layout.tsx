import type { Metadata } from "next";
import "./globals.css";
import { Space_Grotesk, Bebas_Neue } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], display: 'swap', variable: '--font-space-grotesk' });
const bebasNeue = Bebas_Neue({ subsets: ['latin'], weight: '400', display: 'swap', variable: '--font-bebas-neue' });

export const metadata: Metadata = {
  title: "NeedFinder AI",
  description: "Find exactly what you need with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark scroll-smooth ${spaceGrotesk.variable} ${bebasNeue.variable}`}>
      <body className="bg-background-dark text-slate-100 body-font selection:bg-primary selection:text-background-dark antialiased">
        {children}
      </body>
    </html>
  );
}
