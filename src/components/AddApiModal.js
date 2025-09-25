// src/components/AddApiModal.js
"use client";
import { useState } from "react";

export default function AddApiModal({ onClose, onAdd }) {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");

  const handleAdd = () => {
    if (!url) return;
    onAdd({ url, method });
    onClose();
  };

  return (
<div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
  <div className="bg-white p-6 rounded w-96 text-gray-900">
        <h2 className="text-xl font-bold mb-4">Add New API</h2>
        <input
          type="text"
          placeholder="API URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
        />
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
        >
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
        </div>
      </div>
    </div>
  );
}
