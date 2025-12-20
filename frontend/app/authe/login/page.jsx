"use client";

import { useState } from "react";
import Link from "next/link";
import "@/app/globlecss/signup.css"; // हे import करायला विसरू नकोस
import "remixicon/fonts/remixicon.css";

export default function SigninPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);

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

          <form>
            <div className="input-group">
              <input type="text" placeholder="Enter Username" />
            </div>
            <div className="input-group password-group">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter password"
                id="passwordInput"
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

          <div className="social-login">
            <p>Sign up with</p>
            <div className="social-icons">
              <a href="#">
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                  alt="Google"
                />
              </a>
              <a href="#">
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg"
                  alt="Apple"
                />
              </a>
              <Link href="/authe/mobile">
                <i className="ri-phone-fill"></i>
              </Link>
            </div>
          </div>

          <div className="login-link">
            <p>
              Already have an account?{" "}
              <Link href="/authe/singup">Sing Up</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
