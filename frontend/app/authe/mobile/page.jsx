"use client";
import { useEffect } from "react";
import "@/app/globlecss/mobile_authe.css";

export default function Mobile() {
  useEffect(() => {
    const mobileForm = document.getElementById("mobile-form");
    const mobileNumberInput = document.getElementById("mobile-number");
    const mobileLoginView = document.getElementById("mobile-login-view");
    const otpView = document.getElementById("otp-view");
    const displayMobileNumber = document.getElementById("display-mobile-number");
    const otpInputs = document.querySelectorAll(".otp-input-field");
    const otpForm = document.getElementById("otp-form");

    // Smooth transition between views
    const switchView = (fromView, toView) => {
      fromView.classList.remove("active");
      toView.style.transform = "translateX(100%)";
      toView.style.opacity = "0";
      toView.style.display = "block";

      setTimeout(() => {
        toView.classList.add("active");
        toView.style.transform = "translateX(0)";
        toView.style.opacity = "1";
        setTimeout(() => {
          fromView.style.display = "none";
        }, 400);
      }, 10);
    };

    // Handle mobile form submit
    mobileForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const mobileNumber = mobileNumberInput.value;
      displayMobileNumber.textContent = mobileNumber;
      switchView(mobileLoginView, otpView);
      setTimeout(() => {
        otpInputs[0].focus();
      }, 400);
    });

    // Handle OTP input focus
    otpInputs.forEach((input, index) => {
      input.addEventListener("input", (e) => {
        const value = e.target.value;
        if (value.length === 1 && index < otpInputs.length - 1) {
          otpInputs[index + 1].focus();
        }
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && e.target.value === "" && index > 0) {
          e.preventDefault();
          otpInputs[index - 1].focus();
          otpInputs[index - 1].value = "";
        }
      });
    });

    // Handle OTP form submit
    otpForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const otp = Array.from(otpInputs)
        .map((input) => input.value)
        .join("");
      alert(`OTP Verified: ${otp}`);
    });

    // Cleanup event listeners when component unmounts
    return () => {
      mobileForm?.removeEventListener("submit", () => {});
      otpForm?.removeEventListener("submit", () => {});
    };
  }, []);

  return (
    <div className="container">
      <div id="mobile-login-view" className="view active">
        <h2 className="title"> Welcome</h2>
        <p className="subtitle">Enter your mobile number to continue.</p>

        <form id="mobile-form" className="form">
          <div className="input-group">
            <span className="country-code">+91</span>
            <input
              type="tel"
              id="mobile-number"
              className="input-field"
              placeholder="Mobile Number"
              required
              maxLength="10"
              pattern="[0-9]{10}"
            />
          </div>
          <button type="submit" className="btn primary">
            Send OTP
          </button>
        </form>
      </div>

      <div id="otp-view" className="view">
        <h2 className="title">🔑 Verify OTP</h2>
        <p className="subtitle" id="otp-info-text">
          We sent an OTP to +91 <span id="display-mobile-number"></span>
        </p>

        <form id="otp-form" className="form">
          <div className="otp-input-group">
            <input type="text" className="otp-input-field" maxLength="1" required />
            <input type="text" className="otp-input-field" maxLength="1" required />
            <input type="text" className="otp-input-field" maxLength="1" required />
            <input type="text" className="otp-input-field" maxLength="1" required />
          </div>

          <button type="submit" className="btn primary">
            Verify & Login
          </button>

          <p className="resend-text">
            Didn’t receive it? <a href="#" id="resend-link">Resend OTP</a>
          </p>
        </form>
      </div>
    </div>
  );
}
