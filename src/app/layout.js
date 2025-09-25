import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Nextrixio - API Monitoring SaaS",
  description: "Monitor your APIs, track uptime, and receive alerts instantly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <body className="bg-gray-50 text-gray-900">
      <Navbar/>
      <main>{children}</main>
    </body>
  </html>
  );
}
