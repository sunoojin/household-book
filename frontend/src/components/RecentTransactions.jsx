// src/components/RecentTransactions.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api"; // 경로 프로젝트에 맞게 조정
import { MdDeleteForever } from "react-icons/md";
import { FaArrowAltCircleDown } from "react-icons/fa";
import { FaArrowAltCircleUp } from "react-icons/fa";

function formatCurrency(n) {
  // 숫자 -> "₩1,234" 형태
  return n.toLocaleString("ko-KR");
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    // 원하는 형식으로 바꿔 쓰면 됨
    return d.toLocaleDateString("ko-KR");
  } catch {
    return iso;
  }
}

export default function RecentTransactions({ limit = 10 }) {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState(null);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        // 병렬로 받아오기
        const [txRes, catRes] = await Promise.all([
          API.get("/transactions"),
          API.get("/categories"),
        ]);

        // API 응답이 배열로 왔다는 가정 (controller에서 res.json(rows) 반환)
        const txs = Array.isArray(txRes.data)
          ? txRes.data
          : txRes.data.data ?? [];
        const cats = Array.isArray(catRes.data)
          ? catRes.data
          : catRes.data.categories ?? catRes.data.data ?? [];

        // 카테고리 매핑: id -> { name, type, color? }
        const cmap = {};
        (cats || []).forEach((c) => {
          cmap[c.id] = {
            name: c.name || c.title || "Unknown",
            type: c.type || "expense",
            color: c.color || null,
          };
        });

        // 트랜잭션에 카테고리 정보 병합
        const merged = (txs || []).map((t) => {
          const cat = cmap[t.category_id] || {};
          // type: income | expense — 데이터베이스에서 amount sign 또는 category.type에 따라 결정.
          // 여기서는 category.type 우선, 없으면 amount>0이면 income(수입)로 간주
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
        // 최신순으로 정렬(서버에서 이미 정렬했을 수 있음)
        merged.sort((a, b) => new Date(b.trans_date) - new Date(a.trans_date));
        setCategoriesMap(cmap);
        setTransactions(merged.slice(0, limit));
      } catch (err) {
        console.error("RecentTransactions load error:", err);
        if (!mounted) return;
        setError(err.message || "API error");
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [limit]);

  const handleDelete = async (id) => {
    try {
      // 백엔드 라우터: router.delete("/:id", ctrl.deleteTransaction);
      await API.delete(`/transactions/${id}`);

      // 삭제 성공 시 프론트 상태에서도 제거
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
      window.location.reload();
    } catch (err) {
      console.error("delete error:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (error)
    return (
      <section className="card">
        <h2 className="card-title">최근 내역</h2>
        <div style={{ color: "red" }}>Error: {error}</div>
      </section>
    );
  if (transactions === null)
    return (
      <section className="card">
        <h2 className="card-title">최근 내역</h2>
        <div>불러오는 중...</div>
      </section>
    );

  return (
    <section className="card">
      <h2 className="card-title">최근 내역</h2>
      <ul className="transaction-list">
        {transactions.slice(0, 8).map((tx) => (
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
                {/* 아이콘: 수입이면 ↑, 지출이면 ↓ */}
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
      <div style={{ textAlign: "right", marginTop: 8 }}>
        <button
          onClick={() => navigate("/transactions/all")}
          style={{
            background: "transparent",
            border: "none",
            color: "#1976d2",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          전체 내역 보기 &gt;
        </button>
      </div>
    </section>
  );
}
