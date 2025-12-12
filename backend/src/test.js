const mysql = require("mysql2/promise");
require("dotenv").config();

(async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    // port: +process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5,
  });

  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    console.log("DB OK:", rows);
  } catch (err) {
    console.error("DB connection error:", err.message);
  } finally {
    await pool.end();
  }
})();
