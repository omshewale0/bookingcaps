"use client";

import Navbar from "@/components/Navbar";
import "@/app/globlecss/demo.css";
export default function Home(){
    return(
      <div className="main-page">
            <Navbar />
            <div className="demo-container">
            <h1 className="demo-title">car page 🚀</h1>
          </div>
          </div>
    );
}