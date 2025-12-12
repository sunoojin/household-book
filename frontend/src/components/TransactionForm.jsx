// // src/components/TransactionForm.jsx

// src/components/TransactionForm.jsx (수정본)
import React, { useEffect, useState } from "react";
import API from "../api/api";

function TransactionForm({ onCreate }) {
  const [form, setForm] = useState({
    type: "income", // "income" | "expense"
    amount: "",
    category_id: "",
    memo: "",
    date: "",
  });

  const [categories, setCategories] = useState([]); // 현재 화면에 보여줄 목록
  const [allCategories, setAllCategories] = useState([]); // 서버에서 전체 받아올 경우 대비
  const [loadingCats, setLoadingCats] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // 1) 초기(마운트)에는 서버에서 전체 카테고리도 받아온다(폴백용)
  useEffect(() => {
    let mounted = true;
    const loadAll = async () => {
      try {
        const res = await API.get("/categories"); // try full fetch
        const arr = Array.isArray(res.data) ? res.data : [];
        if (mounted) setAllCategories(arr);
      } catch (err) {
        console.error("전체 카테고리 기본 로드 실패:", err);
        if (mounted) setAllCategories([]);
      }
    };
    loadAll();
    return () => (mounted = false);
  }, []);

  // 2) 타입 변경 시 서버에서 타입별로 요청 시도 — 실패하면 클라이언트 필터 사용
  useEffect(() => {
    let mounted = true;
    const loadByType = async () => {
      setLoadingCats(true);
      setError(null);
      try {
        // 서버에 타입 쿼리로 요청 (서버가 지원하면 필터된 목록을 받음)
        const res = await API.get(`/categories?type=${form.type}`);
        const arr = Array.isArray(res.data) ? res.data : [];
        if (arr.length > 0) {
          // 서버가 타입별로 내려준 경우
          if (mounted) setCategories(arr);
        } else {
          // 서버가 빈 배열을 주거나 지원하지 않는 경우: 클라이언트에서 필터
          const filtered = allCategories.filter((c) => {
            // 컬럼명이 'type'인지 'category_type'인지 여기에 대응
            const t = (c.type || c.category_type || "")
              .toString()
              .toLowerCase();
            return t === form.type;
          });
          if (mounted) setCategories(filtered);
        }
      } catch (err) {
        const filtered = allCategories.filter((c) => {
          const t = (c.type || c.category_type || "").toString().toLowerCase();
          return t === form.type;
        });
        if (mounted) setCategories(filtered);
      } finally {
        if (mounted) setLoadingCats(false);
      }
    };

    loadByType();
    return () => (mounted = false);
  }, [form.type, allCategories]);

  // handleChange: type 바꾸면 category 초기화
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "type") {
      // value expected to be "income" or "expense"
      setForm((prev) => ({ ...prev, type: value, category_id: "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setError(null);
    setSuccessMsg(null);
  };

  const validate = () => {
    if (!form.amount) return "금액을 입력하세요.";
    if (!form.category_id) return "카테고리를 선택하세요.";
    if (isNaN(Number(form.amount))) return "금액이 숫자가 아닙니다.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    const amount = Math.abs(Number(form.amount)); // DB 제약 대응
    const payload = {
      amount,
      memo: form.memo || null,
      category_id: Number(form.category_id),
      trans_date: form.date || null,
    };

    try {
      setSubmitting(true);
      const res = await API.post("/transactions", payload);
      setSuccessMsg("거래가 추가되었습니다.");
      setForm({
        type: "income",
        amount: "",
        category_id: "",
        memo: "",
        date: "",
      });
      if (typeof onCreate === "function") onCreate(res.data);
      window.location.reload();
    } catch (err) {
      console.error("트랜잭션 생성 오류", err);
      const msg =
        err?.response?.data?.error || err?.message || "트랜잭션 생성 실패";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="card">
      <h2 className="card-title">거래 추가</h2>

      {error && (
        <div style={{ color: "crimson", marginBottom: 8 }}>{error}</div>
      )}
      {successMsg && (
        <div style={{ color: "green", marginBottom: 8 }}>{successMsg}</div>
      )}

      <form onSubmit={handleSubmit} className="form">
        <label className="form-label">
          타입
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="form-input"
          >
            <option value="income">입금</option>
            <option value="expense">출금</option>
          </select>
        </label>

        <label className="form-label">
          금액
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="form-input"
            placeholder="0"
          />
        </label>

        <label className="form-label">
          카테고리
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="form-input"
            disabled={loadingCats}
          >
            <option value="">
              {loadingCats ? "로딩 중..." : "카테고리 선택"}
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="form-label">
          메모
          <input
            type="text"
            name="memo"
            value={form.memo}
            onChange={handleChange}
            className="form-input"
            placeholder="메모 작성"
          />
        </label>

        <label className="form-label">
          날짜
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="form-input"
          />
        </label>

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "저장중..." : "+ Add Transaction"}
        </button>
      </form>
    </section>
  );
}

export default TransactionForm;
