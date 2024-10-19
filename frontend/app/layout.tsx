import type { Metadata } from "next";
import "./globals.css";
import localFont from '@next/font/local'


export const metadata: Metadata = {
  title: "EchoTestimonials",
  description: "",
};

const monasans = localFont({
  src: [
    {
      path: './fonts/MonaSans/OTF/MonaSans-Regular.otf',
      weight: '400'
    },
  ],
  variable: '--font-monasans'
})

const nohemiBold = localFont({
  src: [
    {
      path: './fonts/Nohemi_Font/Nohemi-SemiBold-BF6438cc57db2ff.woff',
    },
  ],
  variable: '--font-nohemiBold'
})

const primary_regular = localFont({
  src: [
    {
      path: './fonts/Circular/CircularStd-Book.otf',
    },
  ],
  variable: '--font-primary_regular'
})

// Nohemi-Bold-BF6438cc577b524.woff

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${monasans.variable} ${nohemiBold.variable} ${primary_regular.variable} antialiased bg-black`}
      >
        {children}
      </body>
    </html>
  );
}
