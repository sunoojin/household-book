// src/components/Header.jsx
import React from "react";

function Header() {
  return (
    <header className="header">
      <div className="header-icon">📒</div>
      <div>
        <h1 className="header-title">가계부</h1>
        <p className="header-subtitle">Track your income and expenses</p>
      </div>
    </header>
  );
}

export default Header;
