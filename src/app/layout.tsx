import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Inter, PT_Sans } from 'next/font/google'

export const metadata: Metadata = {
  title: "CropAI",
  description: "A personalized AI-powered Smart Farm Assistant App.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: '#267048',
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-headline',
})
 
const pt_sans = PT_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '700']
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${pt_sans.variable}`}>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
