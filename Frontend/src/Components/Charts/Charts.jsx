import React from 'react';
import { Line } from '@ant-design/plots';
import './charts.css'; // Optional CSS if needed for custom tweaks

const Charts = ({ data, xField, yField, title, Amount }) => {
  const config = {
    data,
    xField,
    yField,
    point: {
      visible: false, // Disable points from appearing on the chart
    },
    xAxis: {
      grid: null, // Remove grid lines on the x-axis
    },
    yAxis: {
      grid: null, // Remove grid lines on the y-axis
    },
    lineStyle: {
      lineWidth: 2, // Line thickness
    },
    interaction: {
      tooltip: {
        marker: false,
      },
    },
    responsive: true, // Make chart responsive
  };

  return (
    <div className="line-chart-container p-6 bg-[#ff7200] rounded-xl shadow-lg w-full">
      <h3 className="text-xl sm:text-xl md:text-2xl font-semibold text-gray-800 mb-4">
        {title} - <span className="text-gray-100">{Amount}</span>
      </h3>
      <div className="chart-wrapper w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] bg-white rounded-lg shadow-md overflow-hidden">
        <Line {...config} />
      </div>
    </div>
  );
};

export default Charts;
