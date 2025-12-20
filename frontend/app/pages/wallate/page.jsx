"use client";

import Navbar from "@/components/Navbar";
import "@/app/globlecss/wallate.css";
import "remixicon/fonts/remixicon.css";
export default function Wallate() {
  return (
    <div className="main-container">
      {/* Navbar वर ठेवणे योग्य आहे */}
      <Navbar />

      <div className="dashboard-main">


        {/* Wallet Section */}
        <div className="wallet-section">
          <div className="wallet-title">
            <i className="ri-wallet-line"></i>Wallet
          </div>
          <div className="balance-info">
            <div className="amount">
              ₹1500.50 
            </div>
            <span className="label">Available Balance</span>
          </div>
        </div>

        
        {/* <div className="action-grid">
          <div className="action-card">
            <div className="icon">
              <i className="fas fa-search"></i>
            </div>
            <p>Search Job</p>
          </div>

          <div className="action-card">
            <div className="icon">
              <i className="fas fa-clipboard-list"></i>
            </div>
            <p>Job Management</p>
          </div>

          <div className="action-card">
            <div className="icon">
              <i className="fas fa-history"></i>
            </div>
            <p>History</p>
          </div>
        </div> */}

        {/* Jobs Title */}
        <h2 className="jobs-title"><i class="ri-history-line"></i>  History</h2>
      </div>
    </div>
  );
}
