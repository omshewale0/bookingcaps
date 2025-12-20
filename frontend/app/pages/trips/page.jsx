"use client";

import { useEffect } from "react";
import "@/app/globlecss/trips.css";
import Bottomnav from "@/components/bottom_nav";

export default function Trip() {
  useEffect(() => {
    // 1️⃣ Tab Switching Logic
    const tabButtons = document.querySelectorAll(".tab-switcher .tab-btn");
    tabButtons.forEach((button) => {
      button.addEventListener("click", function () {
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");
        console.log(`Switched to tab: ${this.textContent.trim()}`);
      });
    });

    // 2️⃣ Filter Bar Interaction
    const filterItems = document.querySelectorAll(".filter-bar .filter-item");
    filterItems.forEach((item) => {
      item.addEventListener("click", function () {
        this.classList.toggle("active-filter");
        const filterName = this.querySelector("span")
          ? this.querySelector("span").textContent
          : "Filter";
        console.log(
          `${filterName} toggled. Current state: ${
            this.classList.contains("active-filter") ? "ON" : "OFF"
          }`
        );
      });
    });

    // 3️⃣ Bus Card Click
    const busCards = document.querySelectorAll(".bus-card");
    busCards.forEach((card) => {
      card.addEventListener("click", function () {
        const operator = this.querySelector(".operator-name p")?.textContent;
        console.log(`Clicked on bus: ${operator}`);
      });
    });

    // Cleanup to prevent memory leaks
    return () => {
      tabButtons.forEach((button) =>
        button.replaceWith(button.cloneNode(true))
      );
      filterItems.forEach((item) => item.replaceWith(item.cloneNode(true)));
      busCards.forEach((card) => card.replaceWith(card.cloneNode(true)));
    };
  }, []);

  return (
    <>
      <div className="container">
        <header className="header">
          <div className="top-nav">
            <i className="fas fa-arrow-left"></i>
            <div className="route-details">
              <span>Pune</span>
              <i className="fas fa-arrow-right route-arrow"></i>
              <span>Hingoli</span>
            </div>
            <div className="date-details">
              <span className="date-text">31 Oct</span>
              <span className="day-text">Fri</span>
            </div>
          </div>

          <div className="tab-switcher">
            <button className="tab-btn active">
              <i className="fas fa-bus"></i> Buses
            </button>
            <button className="tab-btn">
              <i className="fas fa-train"></i> Trains
            </button>
          </div>
        </header>

        <section className="filter-bar">
          <div className="filter-item">
            <i className="fas fa-filter"></i>
            <span>Filters</span>
          </div>
          <div className="filter-item dropdown">
            <i className="fas fa-sort-amount-down-alt"></i>
            <span>Sort</span>
            <i className="fas fa-caret-down"></i>
          </div>
          <div className="filter-item">
            <i className="fas fa-percent"></i>
            <span>Deals</span>
          </div>
          <div className="filter-item">
            <i className="fas fa-snowflake"></i>
            <span>AC</span>
          </div>
        </section>

        <main className="bus-list">
          {/* 🚌 एक उदाहरण बस कार्ड */}
          <div className="bus-card primo">
            <div className="bus-details">
              <div className="time-duration">
                <span className="dep-time">20:30</span>
                <span className="duration">10h 30m</span>
                <span className="arr-time">07:00</span>
              </div>
              <div className="seats-available">11 Seats</div>
            </div>
            <div className="travel-info">
              <div className="travel-logo">
                <img src="/img/3d Maruti Ertiga Car.png" alt="Primo Logo" />
              </div>
              <div className="operator-name">
                <span className="primo-tag">Prim</span>
                <p>Sambhuraje Travel Services</p>
                <p className="bus-type">
                  Bharat Benz A/C Sleeper (2+1)
                  <i className="fas fa-map-marker-alt"></i>
                </p>
              </div>
              <div className="price-rating">
                <div className="price">₹600</div>
                <div className="rating">
                  <span className="star-rating">
                    <i className="fas fa-star"></i> 4.0
                  </span>
                  <span className="review-count">248</span>
                </div>
              </div>
              
            </div>
            
          </div>
           <div className="bus-card primo">
            <div className="bus-details">
              <div className="time-duration">
                <span className="dep-time">20:30</span>
                <span className="duration">10h 30m</span>
                <span className="arr-time">07:00</span>
              </div>
              <div className="seats-available">11 Seats</div>
            </div>
            <div className="travel-info">
              <div className="travel-logo">
                <img src="/img/3d Maruti Ertiga Car.png" alt="Primo Logo" />
              </div>
              <div className="operator-name">
                <span className="primo-tag">Prim</span>
                <p className="agency-name">Sambhuraje Travel Services</p>
                <p className="bus-type">
                  Bharat Benz A/C Sleeper (2+1)
                  <i className="fas fa-map-marker-alt"></i>
                </p>
              </div>
              <div className="price-rating">
                <div className="price">₹600</div>
                <div className="rating">
                  <span className="star-rating">
                    <i className="fas fa-star"></i> 4.0
                  </span>
                  <span className="review-count">248</span>
                </div>
              </div>
              
            </div>
            
          </div>
           <div className="bus-card primo">
            <div className="bus-details">
              <div className="time-duration">
                <span className="dep-time">20:30</span>
                <span className="duration">10h 30m</span>
                <span className="arr-time">07:00</span>
              </div>
              <div className="seats-available">11 Seats</div>
            </div>
            <div className="travel-info">
              <div className="travel-logo">
                <img src="/img/3d Maruti Ertiga Car.png" alt="Primo Logo" />
              </div>
              <div className="operator-name">
                <span className="primo-tag">Prim</span>
                 <p className="agency-name">Sambhuraje Travel Services</p>
                <p className="bus-type">
                  Bharat Benz A/C Sleeper (2+1)
                  <i className="fas fa-map-marker-alt"></i>
                </p>
              </div>
              <div className="price-rating">
                <div className="price">₹600</div>
                <div className="rating">
                  <span className="star-rating">
                    <i className="fas fa-star"></i> 4.0
                  </span>
                  <span className="review-count">248</span>
                </div>
              </div>
              
            </div>
            
          </div>
           <div className="bus-card primo">
            <div className="bus-details">
              <div className="time-duration">
                <span className="dep-time">20:30</span>
                <span className="duration">10h 30m</span>
                <span className="arr-time">07:00</span>
              </div>
              <div className="seats-available">11 Seats</div>
            </div>
            <div className="travel-info">
              <div className="travel-logo">
                <img src="/img/3d Maruti Ertiga Car.png" alt="Primo Logo" />
              </div>
              <div className="operator-name">
                <span className="primo-tag">Prim</span>
                 <p className="agency-name">Sambhuraje Travel Services</p>
                <p className="bus-type">
                  Bharat Benz A/C Sleeper (2+1)
                  <i className="fas fa-map-marker-alt"></i>
                </p>
              </div>
              <div className="price-rating">
                <div className="price">₹600</div>
                <div className="rating">
                  <span className="star-rating">
                    <i className="fas fa-star"></i> 4.0
                  </span>
                  <span className="review-count">248</span>
                </div>
              </div>
              
            </div>
            
          </div>
          {/* इतर कार्ड्स तशाच ठेवू शकतो */}
        </main>
      </div>
     <Bottomnav/>
    </>
  );
}
