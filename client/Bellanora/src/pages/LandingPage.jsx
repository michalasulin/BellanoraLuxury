// LandingPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import LandingHeader from "../components/LandingHeader";

const buttonStyle = {
  padding: "12px 32px",
  marginBottom: "20px",
  borderRadius: "12px",
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  color: "#FFD700",
  border: "2px solid rgba(255, 255, 255, 0.3)",
  fontWeight: "bold",
  fontSize: "1.1rem",
  textShadow: "0 0 5px rgba(255, 215, 0, 0.7)",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
  cursor: "pointer",
  transition: "all 0.3s ease-in-out",
};

const buttonContainerStyle = {
  position: "absolute",
  top: "50%",
  right: "5%",
  transform: "translateY(-50%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  zIndex: 2,
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <video
        autoPlay
        loop
        muted
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: "-1",
        }}
      >
        <source src="/videos/background.mp4" type="video/mp4" />
        הדפדפן שלך לא תומך בסרטונים.
      </video>

      <LandingHeader />

    </div>
  );
}
