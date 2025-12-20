"use client";

import { useState } from "react";
import Link from "next/link";
import "@/app/globlecss/signup.css";
import "remixicon/fonts/remixicon.css";

export default function SignupPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          mobile,
          password,
        }),
      });

      const data = await res.json();
      alert(data.message || "Registration successful!");
    } catch (error) {
      alert("Error connecting to server");
      console.error(error);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <span className="back-arrow">&lt; Back</span>
      </header>

      <main className="main-content">
        <div className="card">
          <div className="header-text">
            <h1>Create Your Account</h1>
            <p>
              We're here to help you reach the peaks of learning. Are you ready?
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <input
                type="number"
                placeholder="Enter mobile no"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>

            <div className="input-group password-group">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="password-icon"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                👁️
              </span>
            </div>

            <Link href="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>

            <button type="submit" className="get-started-btn">
              Get Started
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
