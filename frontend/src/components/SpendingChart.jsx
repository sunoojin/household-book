// // src/components/SpendingChart.jsx

import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function SpendingChart({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="chart-wrapper">
        <div className="chart-empty">데이터가 없습니다.</div>
      </div>
    );
  }

  const fallbackColors = [
    "#ff5b5b",
    "#ff9944",
    "#ffd54f",
    "#8bd46b",
    "#4db6ff",
    "#9c6cff",
    "#f06292",
  ];

  return (
    <div className="chart-wrapper">
      <PieChart width={600} height={400}>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={(entry) => `${entry.name} (${entry.percent}%)`}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${entry.id ?? index}`}
              fill={
                entry.color ?? fallbackColors[index % fallbackColors.length]
              }
            />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value}원`} />
        <Legend />
      </PieChart>
    </div>
  );
}

export default SpendingChart;

// import React from "react";
// import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// function SpendingChart({ data }) {
//   return (
//     <div className="chart-wrapper">
//       <PieChart width={260} height={260}>
//         <Pie
//           data={data}
//           dataKey="amount"
//           nameKey="name"
//           cx="50%"
//           cy="50%"
//           outerRadius={100}
//           label
//         >
//           {data.map((entry) => (
//             <Cell key={entry.id} fill={entry.color} />
//           ))}
//         </Pie>
//         <Tooltip />
//         <Legend />
//       </PieChart>
//     </div>
//   );
// }

// export default SpendingChart;
