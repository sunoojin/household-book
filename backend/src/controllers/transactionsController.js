const pool = require("../db");

exports.listTransactions = async (req, res) => {
  // optional: ?category=1&from=2025-01-01&to=2025-01-31
  const { category, from, to } = req.query;
  let sql = "SELECT * FROM transactions";
  const params = [];
  const where = [];
  if (category) {
    where.push("category_id = ?");
    params.push(category);
  }
  if (from) {
    where.push("trans_date >= ?");
    params.push(from);
  }
  if (to) {
    where.push("trans_date <= ?");
    params.push(to);
  }
  if (where.length) sql += " WHERE " + where.join(" AND ");
  sql += " ORDER BY trans_date DESC";
  try {
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
};

exports.createTransaction = async (req, res) => {
  const { amount, memo, category_id, trans_date } = req.body;
  if (!amount || !category_id)
    return res.status(400).json({ error: "amount and category_id required" });
  try {
    const [result] = await pool.query(
      "INSERT INTO transactions (amount, memo, trans_date, category_id) VALUES (?, ?, COALESCE(?, CURRENT_TIMESTAMP), ?)",
      [amount, memo || null, trans_date || null, category_id]
    );
    const [rows] = await pool.query("SELECT * FROM transactions WHERE id = ?", [
      result.insertId,
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM transactions WHERE id = ?", [
      req.params.id,
    ]);
    if (!rows.length) return res.status(404).json({ error: "not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "DB error" });
  }
};

exports.updateTransaction = async (req, res) => {
  const id = req.params.id;
  const { amount, memo, category_id, trans_date } = req.body;
  try {
    await pool.query(
      "UPDATE transactions SET amount=?, memo=?, trans_date=COALESCE(?, trans_date), category_id=? WHERE id=?",
      [amount, memo, trans_date, category_id, id]
    );
    const [rows] = await pool.query("SELECT * FROM transactions WHERE id = ?", [
      id,
    ]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    await pool.query("DELETE FROM transactions WHERE id=?", [req.params.id]);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: "DB error" });
  }
};

// 뷰 사용 예시
exports.viewTransactionDetails = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM vw_transaction_details ORDER BY trans_date DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "DB error" });
  }
};

// exports.viewMonthlySummary = async (req, res) => {
//   try {
//     const [rows] = await pool.query(
//       "SELECT * FROM vw_monthly_summary ORDER BY month DESC"
//     );
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: "DB error" });
//   }
// };

// controller
exports.viewMonthlySummary = async (req, res) => {
  try {
    const { year, month } = req.query; // 문자열로 들어옴
    const y = Number(year);
    const m = Number(month);

    if (!y || !m) {
      return res.status(400).json({ error: "year, month 필요" });
    }

    const monthStr = `${y}-${String(m).padStart(2, "0")}`; // "2025-12"

    // 1) 해당 월의 수익/지출 합계 (vw_monthly_summary 사용)
    const [monthlyRows] = await pool.query(
      `
      SELECT month, transaction_type, total_amount
      FROM vw_monthly_summary
      WHERE month = ?
      `,
      [monthStr]
    );

    // 2) 전체 기간 누적 잔액 (transactions 테이블 직접 조회)
    const [balanceRows] = await pool.query(
      `
      SELECT
        SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE 0 END) AS total_income,
        SUM(CASE WHEN c.type = 'expense' THEN t.amount ELSE 0 END) AS total_expense
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      `
    );

    const totalIncome = balanceRows[0]?.total_income || 0;
    const totalExpense = balanceRows[0]?.total_expense || 0;
    const totalBalance = totalIncome - totalExpense;

    res.json({
      month: monthStr,
      data: monthlyRows, // [{ month, transaction_type, total_amount }, ...]
      totalIncome,
      totalExpense,
      totalBalance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
};

exports.getMonthlyExpenseSummary = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT category_name, 
         SUM(amount) AS total_amount, 
         COUNT(*) AS count
       FROM vw_monthly_expenses
       GROUP BY category_name
       ORDER BY total_amount DESC`
    );

    res.json(rows);
  } catch (err) {
    console.error("getMonthlyExpenseSummary error:", err);
    res.status(500).json({ error: "DB error" });
  }
};
