// src/components/Sidebar.js
"use client";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 p-4 min-h-screen text-gray-800">
      <h2 className="text-xl font-semibold mb-4">APIs</h2>
      <ul className="space-y-2">
        <li>
          <Link href="/dashboard/api/1" className="block p-2 rounded hover:bg-gray-200">API 1</Link>
        </li>
        <li>
          <Link href="/dashboard/api/2" className="block p-2 rounded hover:bg-gray-200">API 2</Link>
        </li>
      </ul>
    </aside>
  );
}
