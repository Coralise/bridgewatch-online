import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "./components/Header";
import { auth, signOut } from "./api/auth/[...nextauth]/auth";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bridgewatch",
  description: "Bridgewatch community hub for Albion Online. Explore servers, connect with players, join our Discord, and stay updated on faction news and events.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()

  const handleSignOut = async () => {
    "use server"
    await signOut()
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider session={session}>
          <Header session={session} onSignOut={handleSignOut} />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
