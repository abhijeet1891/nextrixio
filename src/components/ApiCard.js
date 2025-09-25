// src/components/ApiCard.js
"use client";

export default function ApiCard({ name, status, responseTime }) {
  const color = status === "up" ? "text-green-500" : "text-red-500";
  return (
    <div className="p-4 border rounded shadow-md flex justify-between items-center bg-white text-gray-900">
      <div>
        <h3 className="font-bold">{name}</h3>
        <p>Status: <span className={color}>{status}</span></p>
      </div>
      <div>Response: {responseTime}ms</div>
    </div>
  );
}
