// src/components/Charts/ResponseChart.js
"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ResponseChart({ data }) {
  const chartData = {
    labels: data.map(d => d.time),
    datasets: [{
      label: "Response Time (ms)",
      data: data.map(d => d.value),
      borderColor: "rgb(37, 99, 235)",
      backgroundColor: "rgba(37, 99, 235, 0.5)",
    }]
  };

  return <Line data={chartData} />;
}
