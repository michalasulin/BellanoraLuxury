import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (!user) {
      alert("לא ניתן להתנתק כשאינך מחובר");
      return;
    }
    logout();
    navigate('/login');
  };

  const handleChangePassword = () => {
    if (!user) {
      alert("לא ניתן לשנות סיסמה כשאינך מחובר");
      return;
    }
    navigate('/change-password');
  };

  const handleAdminPanel = () => {
    if (!user || user.role !== 'admin') {
      alert("אין לך הרשאות מנהל");
      return;
    }
    navigate('/admin');
  };

  const buttonStyle = {
   // backgroundColor: '#e2be2dff',
   // color: 'white',
  //  border: 'none',
   // borderRadius: '8px',
   // padding: '15px 30px',
   // fontSize: '1.2rem',
   // fontWeight: 'bold',
  //  cursor: 'pointer',
   // transition: 'background-color 0.3s, transform 0.3s',
   // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',


      padding: "12px 32px",
  marginBottom: "20px",
  borderRadius: "12px",
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  color: "#FFD700",
  border: "2px solid #FFD700",
  fontWeight: "bold",
  fontSize: "1.1rem",
  textShadow: "0 0 5px rgba(255, 215, 0, 0.7)",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
  cursor: "pointer",
  transition: "all 0.3s ease-in-out",
 
  }

  const buttonHoverStyle = {
    backgroundColor: '#e9cb3818',
    transform: 'scale(8.05)',
  };

  return (
    <header style={{
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '1rem',
      borderRadius: '8px',
      backgroundColor: 'rgba(149, 85, 7, 0.14)',
    }}>
      <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <Link to="/">
          <img src={logo} alt="לוגו" style={{ height: '180px', objectFit: 'contain' }} />
        </Link>
      </div>

      <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button 
          style={buttonStyle} 
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
          onClick={() => navigate('/cart')}
        >
            🛒
        </button> 

        <button 
          style={buttonStyle} 
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
          onClick={handleChangePassword}
        >
               🔏        
           </button>
        <button 
          style={buttonStyle} 
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
          onClick={handleLogout}
        >
          📤
        </button>
        {user?.role === 'admin' && (
          <button 
            style={buttonStyle} 
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
            onClick={handleAdminPanel}
          >
            כניסת מנהל
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;
