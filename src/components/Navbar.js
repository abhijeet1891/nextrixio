// src/components/Navbar.js
"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <Link href="/">
        <div className="text-2xl font-bold cursor-pointer">Nextrixio</div>
      </Link>
      <div className="space-x-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/account">Account</Link>
        <Link href="/login">Login</Link>
      </div>
    </nav>
  );
}
