import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

function LandingHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname !== '/') return null;

  const glassButton = {
    fontFamily: 'Broadway',
    width: '240px',
    height: '70px',
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '2.5px solid gold',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    color: 'gold',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    textShadow: '2px 2px 3px black',
    boxShadow: `
      0 0 10px rgba(0, 0, 0, 0.7),
      0 0 20px rgba(0, 0, 0, 0.4) inset,
      0 0 10px rgba(255, 215, 0, 0.4)
    `,
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    textAlign: 'left',
    paddingLeft: '50px',
    position: 'relative',
  };

  const iconStyle = {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1.6rem',
  };

  return (
    <header
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'transparent',
        zIndex: 2,
        pointerEvents: 'none',
      }}
    >
      <img
        src={logo}
        alt="Bellanora Logo"
        style={{
          height: '800px',
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 5px black)',
          pointerEvents: 'auto',
        }}
      />

      <div
        style={{
          position: 'absolute',
          right: '5%',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'auto',
          background: 'rgba(255, 255, 255, 0.15)',
          border: '2px solid rgba(255, 215, 0, 0.4)',
          borderRadius: '32px',
          padding: '40px 30px',
          height: '320px',
          width: '300px',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: `
            0 0 30px rgba(0, 0, 0, 0.3),
            inset 0 0 15px rgba(255, 255, 255, 0.1)
          `,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <button style={glassButton} onClick={() => navigate("/login")}>
          <span style={iconStyle}>🔑</span>
          LOGIN
        </button>
        <button style={glassButton} onClick={() => navigate("/register")}>
          <span style={iconStyle}>📝</span>
          REGISTER
        </button>
        <button style={glassButton} onClick={() => navigate("/forget-password")}>
          <span style={iconStyle}>❓</span>
          FORGET PASSWORD
        </button>
      </div>
    </header>
  );
}

export default LandingHeader;
