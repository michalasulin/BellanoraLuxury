


// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie"; // ✅ נוסיף כדי לבדוק אם יש טוקן
import { loadCartThunk } from "./redux/thunks/cartThunks";

import Layout from './components/Layout';
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import HomePage from "./pages/HomePage";

import AdminPage from './pages/AdminDashboard';
import ShowCakesPage from './pages/ShowCakesPage.jsx';
import DessertPage from './pages/DessertPage';
import SpecialEventsPage from './pages/SpecialEventsPage';
import HospitalityTrayesPage from './pages/HospitalityTrayesPage';
import SavoryHospitalityTrayesPage from './pages/SavoryHospitalityTrayesPage';
import SweetHospitalityTrayesPage from './pages/SweetHospitalityTrayesPage';

import ShowCakeDetailsPage from "./pages/ShowCakeDetailsPage";
import SweetHospitalityTrayesDetailsPage from "./pages/SweetHospitalityTrayesDetailsPage.jsx";
import SavoryHospitalityTrayesDetailsPage from "./pages/SavoryHospitalityTrayesDetailsPage.jsx";    
import DessertDetailsPage from "./pages/DessertDetailsPage";
import SpecialEventsDetailsPage from "./pages/SpecialEventsDetailsPage.jsx";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
// import CheckoutPage from "./pages/CheckoutPage";
// import { CartProvider } from './context/CartContext';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get('token'); // 🔍 בודק אם המשתמש מחובר
    if (token) {
      dispatch(loadCartThunk()); // 🛒 טוען סל רק אם יש טוקן
    }
  }, []);

  return (
    <Routes>
      {/* 🟣 דף נחיתה בלי Layout */}
      <Route path="/" element={<LandingPage />} />

      {/* 🟢 כל השאר עוטף Layout */}
      <Route element={<Layout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/products/showcase-cakes" element={<ShowCakesPage />} />
        <Route path="/products/desserts" element={<DessertPage />} />
        <Route path="/products/special-events" element={<SpecialEventsPage />} />
        <Route path="/products/trays" element={<HospitalityTrayesPage />} />
        <Route path="/products/trays/sweet" element={<SweetHospitalityTrayesPage />} />
        <Route path="/products/trays/savory" element={<SavoryHospitalityTrayesPage />} />
        <Route path="/cake/:id" element={<ShowCakeDetailsPage />} />
        <Route path="/Stray/:id" element={<SavoryHospitalityTrayesDetailsPage />} />
        <Route path="/tray/:id" element={<SweetHospitalityTrayesDetailsPage />} />
        <Route path="/dess/:id" element={<DessertDetailsPage />} />
        <Route path="/event/:id" element={<SpecialEventsDetailsPage />} />

        <Route path="/cart" element={<CartPage />} />
        {/* <Route path="/checkout" element={<CheckoutPage />} /> */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
