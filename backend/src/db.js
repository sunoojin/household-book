// MySQL과 dotenv 불러오기
const mysql = require("mysql2/promise");
require("dotenv").config();

// MySQL 연결 풀 (Connection Pool) 생성
const pool = mysql.createPool({
  host: process.env.DB_HOST, // MySQL 서버주소
  // port: +process.env.DB_PORT, // MySQL이 열려있는 포트
  user: process.env.DB_USER, // DB에 접속할 계정 정보
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, // 사용할 DB 이름
  waitForConnections: true, // 현재 연결이 꽉 차면 새 연결이 생길 때까지 기다렸다가 처리
  connectionLimit: 10, // 최대 10개의 연결을 미리 만들어둠
});

// pool을 다른 파일에서 사용하도록 내보내기
module.exports = pool;
