"use client";

import { useEffect, useState } from "react";
import "./globlecss/home.css";
import "./globlecss/globals.css";
import Link from "next/link";   
import Navbar from "@/components/Navbar";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Logo video logic
    const video = document.getElementById("logoVid") as HTMLVideoElement | null;
    const hide = () => setLoading(false);

    if (video) {
      video.playbackRate = 2.0;
      video.play().catch(() => setTimeout(hide, 2000));
      video.removeAttribute("loop");
      video.addEventListener("ended", hide);
    }

    // -----------------------------
    // 1️⃣ Date Button Logic
    const dateButtons = document.querySelectorAll(".date-btn");
    dateButtons.forEach((button) => {
      button.addEventListener("click", function () {
        dateButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");
      });
    });

    // 2️⃣ Swap Button Logic
    const swapButton = document.querySelector(".swap-button");
    const fromInput = document.getElementById("from-input");
    const toInput = document.getElementById("to-input");

    if (swapButton && fromInput && toInput) {
      swapButton.addEventListener("click", () => {
        const temp = fromInput.value;
        fromInput.value = toInput.value;
        toInput.value = temp;
      });
    }

    // 3️⃣ Women-only Toggle
    const toggleSwitch = document.getElementById("women-booking-toggle");
    if (toggleSwitch) {
      toggleSwitch.addEventListener("change", function () {
        console.log(
          this.checked ? "Booking for women is ON" : "Booking for women is OFF"
        );
      });
    }

    // 4️⃣ Search Bus Button
    const searchBtn = document.querySelector(".search-bus-btn");
    if (searchBtn) {
      searchBtn.addEventListener("click", () => {
        const fromValue = fromInput?.value || "Not specified";
        const toValue = toInput?.value || "Not specified";
        const activeDateBtn = document.querySelector(".date-btn.active");
        const dateValue = activeDateBtn
          ? activeDateBtn.dataset.date
          : "today";

        alert(
          `Searching buses:\nFrom: ${fromValue}\nTo: ${toValue}\nDate: ${dateValue}`
        );
      });
    }

    // 5️⃣ Offer Tabs Filter
    const tabButtons = document.querySelectorAll(".tab-btn");
    const offerCards = document.querySelectorAll(".offer-card");

    tabButtons.forEach((button) => {
      button.addEventListener("click", function () {
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");

        const filter = this.getAttribute("data-filter");

        offerCards.forEach((card) => {
          card.style.display =
            filter === "all" ||
            card.getAttribute("data-category") === filter
              ? "block"
              : "none";
        });
      });
    });

    // 6️⃣ Navbar Active Links
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        navItems.forEach((nav) => nav.classList.remove("active"));
        this.classList.add("active");
      });
    });
  }, []);

  if (loading) {
    return (
      <div className="splash-container">
        <video
          id="logoVid"
          className="logo"
          autoPlay
          muted
          playsInline
          preload="auto"
          poster="/logo/poster.jpg"
        >
          <source src="/logo/logo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <>
      <div className="container">
        <header className="top-offers">
          <div className="offer-item redbus-offer">
            <p>₹100 off</p>
            <p className="service-name">One way</p>
          </div>
          <div className="offer-item redrail-offer">
            <p>₹200 off</p>
            <p className="service-name">Out station</p>
          </div>
          <div className="offer-item hotel-offer">
            <p>UPTO 45% OFF</p>
            <p className="service-name">Rental</p>
          </div>
        </header>

        <main className="bus-booking-section">
          <h2>Bus Tickets</h2>

          <div className="search-form">
            <div className="input-group">
              <i className="fas fa-bus"></i>
              <input type="text" placeholder="From" id="from-input" />
            </div>

            <div className="input-group">
              <i className="fas fa-city"></i>
              <input type="text" placeholder="To" id="to-input" />
              <button className="swap-button">
                <i className="ri-arrow-up-down-line"></i>
              </button>
            </div>

            <div className="input-group date-selector">
              <i className="far fa-calendar-alt"></i>
              <span className="date-text">Date of Journey</span>
              <div className="date-buttons">
                <button className="date-btn active" data-date="today">
                  Today
                </button>
                <button className="date-btn" data-date="tomorrow">
                  Tomorrow
                </button>
              </div>
            </div>
          </div>

          <div className="toggle-group">
            <div className="toggle-info">
              <i className="fas fa-female"></i>
              <p>Female-only seats</p>
              <a href="#">Know more</a>
            </div>
            <label className="switch">
              <input type="checkbox" id="women-booking-toggle" />
              <span className="slider"></span>
            </label>
          </div>
<Link href="/pages/trips/">
        <button className="search-bus-btn">
          <i className="fas fa-search"></i> Search
        </button>
      </Link>
        </main>

        <section className="offers-section">
          <div className="offers-header">
            <h3>Offers</h3>
            <a href="#">View all</a>
          </div>
          <p className="offers-subtitle">Get best deals with great offers</p>

          <div className="offer-tabs">
            <button className="tab-btn active" data-filter="all">
              All
            </button>
            <button className="tab-btn" data-filter="bus">
              Car
            </button>
            <button className="tab-btn" data-filter="train">
              Bike
            </button>
            <button className="tab-btn" data-filter="hotel">
              Auto
            </button>
          </div>

          <div className="offer-cards-container">
            <div className="offer-card" data-category="bus">
              <span className="bus-tag">Bus</span>
              <h4>Save up to Rs 300 on bus tickets</h4>
              <p>Valid till: 26 Nov</p>
            </div>
            <div className="offer-card" data-category="train">
              <span className="train-tag">Train</span>
              <h4>Flat 10% off on train bookings</h4>
              <p>Use code: RAIL10</p>
            </div>
            <div className="offer-card" data-category="bus">
              <span className="bus-tag">Bus</span>
              <h4>Save up to Rs 300 on Karnataka...</h4>
              <p>Valid till: 30 Nov</p>
            </div>
            <div className="offer-card" data-category="hotel">
              <span className="hotel-tag">Hotel</span>
              <h4>Get 20% off on hotel stays</h4>
              <p>Valid for first time users</p>
            </div>
          </div>
        </section>
      </div>

      <Navbar />
    </>
  );
}
