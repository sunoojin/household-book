// Express 라우터 생성
const express = require("express");
const router = express.Router();
console.log("loading transactions router");

// 컨트롤러 가져오기
const ctrl = require("../controllers/transactionsController");

router.get("/", ctrl.listTransactions); // GET /api/transactions?category=..&from=..&to=..
router.post("/", ctrl.createTransaction); // POST /api/transactions
router.get("/:id", ctrl.getTransaction);
router.put("/:id", ctrl.updateTransaction);
router.delete("/:id", ctrl.deleteTransaction);

// 뷰용 엔드포인트
router.get("/view/details", ctrl.viewTransactionDetails); // GET /api/transactions/view/details
router.get("/view/monthly", ctrl.viewMonthlySummary); // GET /api/transactions/view/monthly
router.get("/view/monthly/expense", ctrl.getMonthlyExpenseSummary);

module.exports = router;
