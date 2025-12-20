"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import "remixicon/fonts/remixicon.css";
import "./css/navbar.css";

export default function Navbar() {
  const [activeNav, setActiveNav] = useState("Home");
  const [loginOpen, setLoginOpen] = useState(false);
  const loginRef = useRef(null);

  // Close login dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (loginRef.current && !loginRef.current.contains(e.target)) {
        setLoginOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          {/* Logo */}
          <h1 className="logo">🌾 AgriToken</h1>

          {/* Desktop Links */}
          <div className="nav-links">
            <Link href="/" className={activeNav === "Home" ? "active" : ""}>
              Home
            </Link>
            <Link
              href="/pages/bookings/"
              className={activeNav === "Marketplace" ? "active" : ""}
            >
              Booking
            </Link>
            <Link
              href="/pages/contact/"
              className={activeNav === "Farmer" ? "active" : ""}
            >
              Contact Us
            </Link>
            <Link
              href="/pages/userdashbord/"
              className={activeNav === "Buyer" ? "active" : ""}
            >
              My Profile
            </Link>
          </div>

          {/* Login Dropdown */}
          <div className="login-container" ref={loginRef}>
            <button
              className="login-btn"
              onClick={(e) => {
                e.stopPropagation();
                setLoginOpen(!loginOpen);
              }}
            >
              <i className="ri-user-line"></i> Login
            </button>

            {loginOpen && (
              <div className="login-dropdown">
                <Link href="/authe/login">
                <button className="btn btn-google">
                  <i className="ri-mail-line"></i> Continue with Email
                </button>
                </Link>

                <div className="divider">or</div>

                <button className="btn btn-google">
                  <span className="g-icon">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                      alt="Google"
                    />
                  </span>
                  Continue with Google
                </button>

                <br />
                <button className="btn btn-google">
                  <span className="g-icon">
                    <img
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg"
                      alt="Apple"
                    />
                  </span>
                  Continue with Apple
                </button>

                <br />
                <button className="btn btn-phone">
                  <i className="ri-phone-fill"></i> Continue with Phone
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Bottom Nav (Mobile only) */}
      <div className="bottom-nav">
        <Link
          href="/"
          className={activeNav === "Home" ? "active" : ""}
          onClick={() => setActiveNav("Home")}
        >
          <i className="ri-home-5-fill"></i>
          <span>Home</span>
        </Link>
        <Link
          href="/pages/bookings/"
          className={activeNav === "Supporting" ? "active" : ""}
          onClick={() => setActiveNav("Supporting")}
        >
          <i className="ri-heart-line"></i>
          <span>Booking</span>
        </Link>
        {/* <Link
          href="/pages/productlisting/"
          className={activeNav === "Productadd" ? "active" : ""}
          onClick={() => setActiveNav("Add Product")}
        >
          <i className="ri-add-line"></i>
          <span>Add Product</span>
        </Link> */}
        <Link
          href="/pages/contact/"
          className={activeNav === "Collections" ? "active" : ""}
          onClick={() => setActiveNav("Collections")}
        >
          <i className="ri-gallery-line"></i>
          <span>Contact Us</span>
        </Link>
        <Link
          href="/pages/userdashbord/"
          className={activeNav === "Profile" ? "active" : ""}
          onClick={() => setActiveNav("Profile")}
        >
          <i className="ri-user-line"></i>
          <span>My Profile</span>
        </Link>
      </div>
    </>
  );
}
