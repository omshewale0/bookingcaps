"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import "remixicon/fonts/remixicon.css";
import "./css/navbar.css";

export default function Bottomnav() {
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
      {/* Bottom Nav (Mobile only) */}
      <div className="bottom-nav">
        <Link
          href="/pages/home/"
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
