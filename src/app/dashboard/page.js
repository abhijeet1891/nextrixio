"use client";
import { useState } from "react";
import ApiCard from "../../components/ApiCard";
import AddApiModal from "../../components/AddApiModal";

export default function DashboardPage() {
  const [apis, setApis] = useState([
    { id: 1, name: "API 1", status: "up", responseTime: 120 },
    { id: 2, name: "API 2", status: "down", responseTime: 0 },
  ]);
  const [showModal, setShowModal] = useState(false);

  const addApi = (api) => {
    setApis([...apis, { id: apis.length + 1, name: api.url, status: "up", responseTime: 100 }]);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold  text-gray-900">Dashboard</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add API
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apis.map(api => <ApiCard key={api.id} {...api} />)}
      </div>
      {showModal && <AddApiModal onClose={() => setShowModal(false)} onAdd={addApi} />}
    </div>
  );
}
