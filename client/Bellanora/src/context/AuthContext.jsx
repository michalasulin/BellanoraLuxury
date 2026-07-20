// import { createContext, useContext, useEffect, useState } from 'react';
// import { getMe, logout as logoutService } from '../api/authService';
// import { useNavigate } from 'react-router-dom';
// //import { useCart } from "./CartContext";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const data = await getMe(); // מחזיר את המשתמש עצמו
//         setUser(data); // 👈 פה כל הנתונים של המשתמש
//       } catch {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, []);

//   const logout = async () => {
//     try {
//       await logoutService();
//       setUser(null);
//       navigate('/');
   

//     } catch {
//       console.error("שגיאה בהתנתקות");
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);






// import { createContext, useContext, useEffect, useState } from 'react';
// import { getMe, logout as logoutService } from '../api/authService';
// import { useNavigate } from 'react-router-dom';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUser = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setLoading(false);
//         return;
//       }
//       try {
//         const data = await getMe();
//         setUser(data);
//       } catch (error) {
//         localStorage.removeItem('token');
//         setUser(null);
//         navigate('/login');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [navigate]);

//   const logout = async () => {
//     try {
//       await logoutService();
//     } catch (error) {
//       console.error("שגיאה בהתנתקות", error);
//     } finally {
//       localStorage.removeItem('token');
//       setUser(null);
//       navigate('/login');
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, logout, loading }}>
//       {loading ? <div>טוען מידע על המשתמש...</div> : children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);





// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import {getUserFromToken}   from '../api/authService';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      setIsLoading(false);

      return;
    }

    getUserFromToken()
      .then((data) => {
        setUser(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('❌ getMe נכשל:', err);
        setIsLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
