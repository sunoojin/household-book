// src/components/SpendingList.jsx
import React from "react";

function formatCurrency(n) {
  // 숫자 -> "₩1,234" 형태
  return n.toLocaleString("ko-KR");
}

function SpendingList({ data }) {
  return (
    <div className="spending-list">
      {data.map((item) => (
        <div key={item.id} className="spending-row">
          <div className="spending-left">
            <span
              className="spending-dot"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.name}</span>
          </div>
          <div className="spending-right">
            <span>{formatCurrency(item.amount)} 원</span>
            <span>{item.percent.toFixed(1)}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SpendingList;
