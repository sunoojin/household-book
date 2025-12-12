# 가계부 프로젝트

본 프로젝트는 **React**와 **MySQL**을 기반으로 한 개인 가계부 웹 애플리케이션입니다.  
사용자는 수입과 지출을 기록하고, 월별 통계 및 시각화된 분석 정보를 확인할 수 있습니다.


## 주요 기능

1. **대시보드**
   - 수입, 지출, 잔액 요약 카드
   - 이번 달 수익/소비 확인

2. **거래 내역 관리**
   - 최근 거래 내역 확인
   - 전체 거래 내역 조회 가능
   - 거래 추가/삭제 지원

3. **월별 통계 및 분석**
   - 월별 지출 통계 차트
   - 시각화된 그래프 제공

## 기술 스택

- **Frontend:** React, React Router, Tailwind CSS
- **Backend:** Node.js, Express (API)
- **Database:** MySQL
- **API 연동:** Axios

## 프로젝트 구조
```
project-root/
├─ backend/
│  ├─ migrations/
│  ├─ node_modules/
│  └─ src/
│     ├─ controllers/
│     │  ├─ categoriesController.js	  // categories 테이블 실제 데이터 처리 로직
│     │  └─ transactionsController.js	// transactions 테이블 실제 데이터 처리 로직
│     └─ routes/
│        ├─ categories.js		// categories 라우터 연결
│        ├─ transactions.js	// transactions 라우터 연결
│        ├─ db.js	// DB 연결 처리
│        ├─ index.js	// 서버 시작, 전체 세팅 (Express 미들웨어)
│        ├─ test-server-info.js
│        └─ test.js
├─ .env		// DB 연결 정보
├─ package.json
├─ package-lock.json
└─ frontend/
   ├─ node_modules/
   ├─ public/
   └─ src/
      ├─ api/
      │  └─ api.js		    // API 연결 세팅
      ├─ components/
      │  ├─ AllTransactionsPage.jsx	  // 전체 소비 내역 페이지
      │  ├─ Header.jsx	        // 가계부 헤더
      │  ├─ MainSection.jsx	      // TransactionForm + RecentTransactions
      │  ├─ MonthlyAnalytics.jsx	 // SpendingChart + SpendingList
      │  ├─ RecentTransactions.jsx	// 최근 거래 내역 8개
      │  ├─ SpendingChart.jsx		// 소비 분석 원 그래프
      │  ├─ SpendingList.jsx		// 소비 분석 리스트
      │  ├─ SummaryCards.jsx		// 전체  잔액, 이번달 수익, 이번달 소비 요약
      │  └─ TransactionForm.jsx		// 거래 추가
      ├─ App.css
      ├─ App.jsx
      ├─ index.css
      ├─ main.jsx
      └─ styles.css
```

## 설치 및 실행 방법

### 1. Backend (MySQL + API)

#### (1) MySQL 서버 시작

WSL 또는 Linux 환경에서 MySQL 서버를 실행

```
sudo service mysql start
```
#### (2) 데이터베이스 초기화

MySQL 접속 후 초기화 SQL 파일을 실행
```
mysql -u root -p
source ./database/init.sql
exit
```
#### (3) Backend 서버 실행

Node.js가 설치된 환경에서 backend 디렉토리로 이동 후 서버 실행
```
cd backend/src
node index.js
```
서버가 정상적으로 실행되면 `http://localhost:4000` (혹은 설정한 포트)에서 API를 확인할 수 있습니다.

### 2. Frontend

Window에서 의존성 설치 후 개발 서버 실행
```
npm install
npm start
```

## 참고 사항

- 실제 데이터베이스 연동 시 API 서버와 MySQL 서버를 함께 실행해야 함
- 날짜 선택 없이도 이번 달 요약 확인 가능

## 개발자 정보
동국대학교 컴퓨터공학과 23학번 오정인
