// src/components/MainSection.jsx
import React from "react";
import TransactionForm from "./TransactionForm";
import RecentTransactions from "./RecentTransactions";

function MainSection() {
  return (
    <section className="main-section">
      <TransactionForm />
      <RecentTransactions />
    </section>
  );
}

export default MainSection;
