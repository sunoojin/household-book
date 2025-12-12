// Express 라우터 생성
const express = require("express");
const router = express.Router();
console.log("loading categories router");

// 컨트롤러 가져오기
const ctrl = require("../controllers/categoriesController");

router.get("/", ctrl.listCategories); // GET /api/categories: 전체 카테고리 목록 조회
router.post("/", ctrl.createCategory); // POST /api/categories: 새 카테고리 생성
router.get("/:id", ctrl.getCategory); // GET /api/categories/:id: 특정 카테고리 상세 조회
router.put("/:id", ctrl.updateCategory); // PUT /api/categories/:id: 카테고리 수정
router.delete("/:id", ctrl.deleteCategory); // DELETE /api/categories/:id: 카테고리 삭제

// 라우터 export
module.exports = router;
