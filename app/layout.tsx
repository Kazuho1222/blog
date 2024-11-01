import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "./components/footer";
import Header from "./components/header";
import "./globals.css";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
// import GoogleAnalytics from "./components/googleanalytics";

config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "blog",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="jp">
      <body className={inter.className}>
        {/* <Suspense>
          <GoogleAnalytics />
        </Suspense> */}
        {/* <Suspense fallback={<Loading />}> */}
        <Header />
        {children}
        <Toaster />
        <Footer />
        {/* </Suspense> */}
      </body>
    </html>
  );
}