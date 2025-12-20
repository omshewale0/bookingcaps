"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import "@/app/globlecss/profile_edite.css";

export default function Profiledite() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "Jhone Williams",
    email: "jhonewilliams@gmail.com",
    location: "Lurah Bilut, Pahang, Malaysia",
    language: "english",
    educationLevel: "degree",
    course: "BCA",
  });

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <>
      <Navbar />
      <div className="account-container">
        <div className="header-section">
          <div className="header-top">
            <i className="fas fa-arrow-left"></i>
            <h1>My Account</h1>
          </div>
        </div>

        <div className="profile-pic-container">
          <div className="profile-image">
            <img
              src="https://via.placeholder.com/150/000000/FFFFFF?text=JW"
              alt="Profile Picture"
            />
          </div>
          <div className="edit-icon" onClick={toggleEdit}>
            <i className={`fas ${isEditing ? "fa-check" : "fa-pencil-alt"}`}></i>
          </div>
        </div>

        <div className="main-card">
          <div className="info-section">
            <label htmlFor="fullName">Full name</label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              readOnly={!isEditing}
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>

          <div className="info-section location-lang-section">
            <label htmlFor="location">Location</label>
            <div className="input-with-icon">
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={handleChange}
                readOnly={!isEditing}
              />
              <i className="fas fa-search"></i>
            </div>

            <label htmlFor="language">Language</label>
            <div className="select-wrapper">
              <select
                id="language"
                value={formData.language}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="english">English</option>
                <option value="marathi">Marathi</option>
              </select>
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>

          <div className="info-section education-section">
            <label htmlFor="educationLevel">Education Level</label>
            <div className="select-wrapper">
              <select
                id="educationLevel"
                value={formData.educationLevel}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="degree">Degree</option>
                <option value="diploma">Diploma</option>
              </select>
              <i className="fas fa-chevron-down"></i>
            </div>

            <label htmlFor="course">Course</label>
            <input
              type="text"
              id="course"
              value={formData.course}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
        </div>
      </div>
    </>
  );
}
