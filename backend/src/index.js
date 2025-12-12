// // 라이브러리 호출
const express = require("express"); // 서버 생성 프레임워크
const cors = require("cors"); // React와 통신 시 CORS 문제 해결
require("dotenv").config(); // .env 파일 내용 호출

// // 라우터 API 코드 호출
const categoriesRouter = require("./routes/categories");
const transactionsRouter = require("./routes/transactions");

// Express 앱 생성 + 기본 미들웨어 생성
const app = express();
app.use(cors()); // React에서 API 호출할 때 허용해주는 설정
app.use(express.json()); // 요청에서 JSON을 자동으로 파싱 가능하게

// 라우터 연결
app.use("/api/categories", categoriesRouter);
app.use("/api/transactions", transactionsRouter);

// Health Check API: 서버가 살아 있는지 확인
app.get("/api/health", (req, res) => res.json({ ok: true, ts: Date.now() }));

// 서버 시작
const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
app.listen(4000, "0.0.0.0", () => {
  console.log("Server listening on 4000");
});
