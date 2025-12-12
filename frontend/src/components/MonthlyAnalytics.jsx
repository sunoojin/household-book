// src/components/MonthlyAnalytics.jsx
import React, { useEffect, useState } from "react";
import SpendingChart from "./SpendingChart";
import SpendingList from "./SpendingList";

const API_URL = "http://localhost:4000/api/transactions/view/monthly/expense";

function MonthlyAnalytics() {
  const [spendingData, setSpendingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMonthlyExpense = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(API_URL);
        if (!res.ok) {
          throw new Error("API 호출 실패");
        }

        const rawData = await res.json(); // <- API 응답 배열

        // total 합계 계산
        const totalAmount = rawData.reduce(
          (sum, item) => sum + Number(item.total_amount),
          0
        );

        // SpendingChart / SpendingList에서 사용할 형태로 변환
        const mapped = rawData.map((item, index) => {
          const amount = Number(item.total_amount);
          const percent =
            totalAmount === 0
              ? 0
              : Number(((amount / totalAmount) * 100).toFixed(1));

          return {
            id: index + 1,
            name: item.category_name,
            amount,
            percent,
            // color는 옵션; 없으면 SpendingChart에서 fallback 색상 사용
          };
        });

        setSpendingData(mapped);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyExpense();
  }, []);

  if (loading) {
    return (
      <section className="analytics">
        <h2 className="card-title">이번달 소비 분석</h2>
        <div className="analytics-body">로딩 중...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="analytics">
        <h2 className="card-title">이번달 소비 분석</h2>
        <div className="analytics-body">에러: {error}</div>
      </section>
    );
  }

  return (
    <section className="analytics">
      <h2 className="card-title">이번달 소비 분석</h2>
      <div className="analytics-body">
        <SpendingChart data={spendingData} />
        <SpendingList data={spendingData} />
      </div>
    </section>
  );
}

export default MonthlyAnalytics;
