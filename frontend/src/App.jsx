// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import MainSection from "./components/MainSection";
import MonthlyAnalytics from "./components/MonthlyAnalytics";
import AllTransactions from "./components/AllTransactionsPage";
import "./styles.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SummaryCards />
                <MainSection />
                <MonthlyAnalytics />
              </>
            }
          />
          <Route path="/transactions/all" element={<AllTransactions />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
