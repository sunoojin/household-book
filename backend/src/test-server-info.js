// src/test-server-info.js
const mysql = require("mysql2/promise");
require("dotenv").config();

(async () => {
  console.log("Using env:", {
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
  });

  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    const [rows] = await conn.query(
      "SELECT @@hostname AS server_host, @@port AS server_port, VERSION() AS version, USER() AS connected_as"
    );
    console.log("Server info:", rows);
    await conn.end();
  } catch (err) {
    console.error("Connection error:", err.message);
  }
})();
