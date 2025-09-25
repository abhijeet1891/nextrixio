// src/components/AlertModal.js
"use client";
import { useState } from "react";

export default function AlertModal({ onClose, onSave }) {
  const [threshold, setThreshold] = useState(500);

  const handleSave = () => {
    onSave({ threshold });
    onClose();
  };

  return (
<div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
  <div className="bg-white p-6 rounded w-96 text-gray-900">
        <h2 className="text-xl font-bold mb-4">Set Alert Threshold (ms)</h2>
        <input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
}
