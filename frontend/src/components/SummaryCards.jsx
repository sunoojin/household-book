// src/components/SummaryCards.jsx
import React, { useEffect, useState } from "react";
import API from "../api/api";

function formatKRW(n) {
  return n.toLocaleString("ko-KR");
}

export default function SummaryCards({ year, month }) {
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const now = new Date();
  const y = year ?? now.getFullYear();
  const m = month ?? now.getMonth() + 1; // 1..12

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        // 1️⃣ 이번 달 수익/소비
        const monthlyResp = await API.get(
          `/transactions/view/monthly?year=${y}&month=${m}`
        );

        const monthlyData = Array.isArray(monthlyResp.data.data)
          ? monthlyResp.data.data
          : [];

        const totalsThisMonth = monthlyData.reduce(
          (acc, item) => {
            const type = (item.transaction_type || "").toLowerCase();
            const amt = Number(item.total_amount || 0);
            if (type === "income") acc.income += amt;
            else if (type === "expense") acc.expense += amt;
            return acc;
          },
          { income: 0, expense: 0 }
        );

        // 2️⃣ 전체 잔액
        const totalResp = await API.get("/transactions/view/details");
        const totalData = Array.isArray(totalResp.data) ? totalResp.data : [];

        let totalIncome = 0;
        let totalExpense = 0;
        totalData.forEach((item) => {
          if (item.category_type === "income")
            totalIncome += Number(item.amount);
          else if (item.category_type === "expense")
            totalExpense += Number(item.amount);
        });

        const totalBalance = totalIncome - totalExpense;

        if (!mounted) return;
        setSummary({
          income: totalsThisMonth.income,
          expense: totalsThisMonth.expense,
          balance: totalBalance,
        });
      } catch (err) {
        console.error("summary load error:", err);
        if (!mounted) return;
        setError(err.message || "API error");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [y, m]);

  if (loading) return <section className="summary">불러오는 중...</section>;
  if (error)
    return (
      <section className="summary" style={{ color: "red" }}>
        요약 불러오기 실패: {error}
      </section>
    );

  return (
    <section className="summary">
      <div className="summary-card positive">
        <p className="summary-label">전체 잔액</p>
        <p className="summary-value">₩{formatKRW(summary.balance)}</p>
      </div>
      <div className="summary-card positive">
        <p className="summary-label">이번달 수익</p>
        <p className="summary-value">₩{formatKRW(summary.income)}</p>
      </div>
      <div className="summary-card negative">
        <p className="summary-label">이번달 소비</p>
        <p className="summary-value">₩{formatKRW(summary.expense)}</p>
      </div>
    </section>
  );
}
