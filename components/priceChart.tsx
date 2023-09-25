import React from "react";

const Chart = () => {
  // Sample price data for 5 points over 24 hours
  const priceData = [20, 40, 20, 30, 35, 40, 54];

  // Define the chart dimensions
  const chartWidth = 200;
  const chartHeight = 50;

  // Calculate the x and y scales
  const xScale = (index) => (index / (priceData.length - 1)) * chartWidth;
  const yScale = (price) =>
    chartHeight - (price / Math.max(...priceData)) * chartHeight;

  // Generate the path data for the line chart
  const pathData = priceData
    .map((price, index) => {
      const x = xScale(index);
      const y = yScale(price);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={chartWidth} height={chartHeight}>
      {/* Price line */}
      <polyline points={pathData} fill="none" stroke="purple" strokeWidth="2" />
      {/* Data points */}
      {priceData.map(
        (price, index) =>
          index !== 0 &&
          (index !== priceData.length - 1) == 1 && (
            <circle
              key={index}
              cx={xScale(index)}
              cy={yScale(price)}
              r="4"
              fill="purple"
              stroke="white"
              strokeWidth="2"
            />
          ),
      )}
    </svg>
  );
};

export default Chart;
