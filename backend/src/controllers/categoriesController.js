const pool = require("../db");

// // 전체 카테고리 조회
// exports.listCategories = async (req, res) => {
//   try {
//     // DB에서 카테고리 목록 SELECT
//     const [rows] = await pool.query(
//       "SELECT id, name, type FROM categories ORDER BY type, name"
//     );
//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "DB error" });
//   }
// };

// 전체 + 타입별 카테고리 조회
exports.listCategories = async (req, res) => {
  try {
    const requestedType = (req.query.type || "")
      .toString()
      .trim()
      .toLowerCase();

    let sql = "SELECT id, name, type FROM categories";
    let params = [];

    if (requestedType === "income" || requestedType === "expense") {
      sql += " WHERE type = ?";
      params.push(requestedType);
    }

    sql += " ORDER BY type, name";

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("listCategories error:", err);
    res.status(500).json({ error: "DB error" });
  }
};

// 카테고리 추가
exports.createCategory = async (req, res) => {
  const { name, type } = req.body;
  // 새로운 카테고리 INSERT
  if (!name || !type)
    return res.status(400).json({ error: "name and type required" });
  try {
    const [resInsert] = await pool.query(
      "INSERT INTO categories (name,type) VALUES (?, ?)",
      [name, type]
    );
    const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [
      resInsert.insertId,
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === "ER_DUP_ENTRY")
      return res.status(409).json({ error: "duplicate category" });
    res.status(500).json({ error: "DB error" });
  }
};

// 특정 카테고리 조회
exports.getCategory = async (req, res) => {
  const id = req.params.id;
  // id로 하나 SELECT
  try {
    const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [
      id,
    ]);
    if (!rows.length) return res.status(404).json({ error: "not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "DB error" });
  }
};

// 카테고리 수정
exports.updateCategory = async (req, res) => {
  const id = req.params.id;
  const { name, type } = req.body;
  // namge/type 변경
  try {
    await pool.query("UPDATE categories SET name=?, type=? WHERE id=?", [
      name,
      type,
      id,
    ]);
    const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [
      id,
    ]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
};

// 카테고리 삭제
exports.deleteCategory = async (req, res) => {
  const id = req.params.id;
  // id로 DELETE
  try {
    await pool.query("DELETE FROM categories WHERE id=?", [id]);
    res.json({ deleted: true });
  } catch (err) {
    console.error(err);
    // FK 제약 등으로 삭제 거부될 수 있음
    if (err.errno === 1451) {
      return res
        .status(400)
        .json({ error: "category in use (has transactions)" });
    }
    res.status(500).json({ error: "DB error" });
  }
};
