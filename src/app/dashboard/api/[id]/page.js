"use client";
import { useState } from "react";
import ResponseChart from "../../../../components/Charts/ResponseChart";
import { useParams } from "next/navigation";

export default function ApiDetailsPage({ params }) {
  const unwrappedParams = useParams;
  const { id } = unwrappedParams;

  const [data] = useState([
    { time: "10:00", value: 120 },
    { time: "11:00", value: 130 },
    { time: "12:00", value: 90 },
    { time: "13:00", value: 100 },
  ]);

  return (
    <div className="text-gray-900">
      <h1 className="text-3xl font-bold mb-4">API Details - {id}</h1>
      <div className="bg-white p-6 rounded shadow">
        <ResponseChart data={data} />
      </div>
    </div>
  );
}
