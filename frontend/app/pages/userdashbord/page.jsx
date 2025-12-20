"use client";

import Navbar from "@/components/Navbar";
import "@/app/globlecss/userdashbord.css";
import "remixicon/fonts/remixicon.css";
import Link from "next/link";
export default function Userdashbord() {
  return (
       
    <div className="profile-container">
      <header className="profile-header">
       
      </header>
<Navbar/>
      <main className="profile-card">
        <div className="user-info-section">
          <div className="profile-picture-container">
            <div className="profile-picture"></div>
          </div>
          <h2 className="user-name">Jhone Williams</h2>
          <p className="contact-detail phone-number">+60 9876543210</p>
          <p className="contact-detail email">jhonewilliams@gmail.com</p>
        </div>

        <ul className="profile-menu-list">
            <Link href="/pages/profile_edite/">
          <li>
            <span className="material-icons menu-icon"><i className="ri-user-line"></i></span>
            My Profile    
          </li></Link>
          <Link href="/pages/wallate/">
          <li>
            <span className="material-icons menu-icon"><i className="ri-wallet-line"></i></span>
            Wallate
          </li></Link>
          <Link href="/pages/bookings/"><li>
            <span className="material-icons menu-icon"><i className="ri-briefcase-line"></i></span>
            Bookings
          </li></Link>
           <Link href="/pages/password_change/"><li>
            <span className="material-icons menu-icon"><i className="ri-key-2-fill"></i></span>
            Change Password
          </li></Link>
        </ul>
      </main>

      <section className="settings-section">
        <ul className="settings-list">
          <li className="section-heading">About Us</li>
          <li>Terms of Service</li>
        </ul>
      </section>
    </div>
    
  );
  
}
