import React, { useEffect, useState } from "react";
import API from "../api/api";
import { MdDeleteForever } from "react-icons/md";
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from "react-icons/fa";

function formatCurrency(n) {
  return n.toLocaleString("ko-KR");
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("ko-KR");
  } catch {
    return iso;
  }
}

export default function AllTransactions() {
  const [transactions, setTransactions] = useState(null);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [txRes, catRes] = await Promise.all([
          API.get("/transactions"),
          API.get("/categories"),
        ]);

        const txs = Array.isArray(txRes.data)
          ? txRes.data
          : txRes.data.data ?? [];
        const cats = Array.isArray(catRes.data)
          ? catRes.data
          : catRes.data.categories ?? catRes.data.data ?? [];

        const cmap = {};
        (cats || []).forEach((c) => {
          cmap[c.id] = {
            name: c.name || "Unknown",
            type: c.type || "expense",
            color: c.color || null,
          };
        });

        const merged = (txs || []).map((t) => {
          const cat = cmap[t.category_id] || {};
          const type = cat.type || (t.amount > 0 ? "income" : "expense");
          return {
            ...t,
            categoryName: cat.name || "Uncategorized",
            categoryType: type,
            categoryBackgroundColor:
              cat.color || (type === "income" ? "#DBFCE7" : "#FFE2E2"),
            categoryArrowColor:
              cat.color || (type === "income" ? "#4CAF50" : "#f44336"),
          };
        });

        if (!mounted) return;
        merged.sort((a, b) => new Date(b.trans_date) - new Date(a.trans_date));
        setCategoriesMap(cmap);
        setTransactions(merged);
      } catch (err) {
        console.error("AllTransactions load error:", err);
        if (!mounted) return;
        setError(err.message || "API error");
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    } catch (err) {
      console.error("delete error:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (error)
    return (
      <section className="card">
        <h2 className="card-title">전체 내역</h2>
        <div style={{ color: "red" }}>Error: {error}</div>
      </section>
    );
  if (transactions === null)
    return (
      <section className="card">
        <h2 className="card-title">전체 내역</h2>
        <div>불러오는 중...</div>
      </section>
    );

  return (
    <section className="card">
      <h2 className="card-title">전체 내역</h2>
      <ul className="transaction-list">
        {transactions.map((tx) => (
          <li key={tx.id} className="transaction-item">
            <div className="transaction-left">
              <div
                className="transaction-icon"
                title={tx.categoryName}
                style={{
                  backgroundColor: tx.categoryBackgroundColor,
                  color: tx.categoryArrowColor,
                  borderRadius: 90,
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                }}
              >
                {tx.categoryType === "income" ? (
                  <FaArrowAltCircleUp />
                ) : (
                  <FaArrowAltCircleDown />
                )}
              </div>
              <div style={{ marginLeft: 12 }}>
                <p className="transaction-title">
                  {tx.memo || tx.title || "메모 없음"}
                </p>
                <p className="transaction-meta">
                  {formatDate(tx.trans_date)} · {tx.categoryName}
                </p>
              </div>
            </div>
            <div className="transaction-left">
              <div
                className={`transaction-amount ${
                  tx.categoryType === "income" ? "income" : "expense"
                }`}
              >
                {tx.categoryType === "income"
                  ? `+₩${formatCurrency(tx.amount)}`
                  : `-₩${formatCurrency(tx.amount)}`}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => handleDelete(tx.id)}
                  className="delete-button"
                >
                  <MdDeleteForever />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
