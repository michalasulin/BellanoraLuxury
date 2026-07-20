import { Link } from 'react-router-dom';
import { useState } from 'react';
import logo from '../assets/logo.png';

function HomePage() {
  const [showSubMenu, setShowSubMenu] = useState(false);

  const styles = {
    container: {
     // background: '🎂', // צבע חום בהיר
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      margin: '20px',
      minHeight: '100vh', // כדי להבטיח שהרקע מכסה את כל גובה העמוד
    },
    card: {
      background: 'linear-gradient(135deg, #411e02ff, #743506ff)',
      color: 'white',
      borderRadius: '15px',
      border: '2px solid rgba(0,0,0)',
      width: '250px',
      height: '250px',
      margin: '15px',
      textAlign: 'center',
      padding: '10px',
      position: 'relative',
      overflow: 'hidden',
      top: '80px',
    },
    link: {
      textDecoration: 'none',
      color: 'black',
      fontWeight: 'bold',
      fontSize: '50px',
      fontFamily: 'Bradley Hand ITC',
      color: '#e8e1bdff',
      textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1,
    },
    icon: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '300px',
      opacity: 0.15,
      zIndex: 0,
      color: 'rgba(255, 255, 255)',
    },
    subMenu: {
      marginTop: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <span style={styles.icon}>🍰</span>
        <Link style={styles.link} to="/products/showcase-cakes">Showcase cakes</Link>
      </div>
      <div style={styles.card}>
        <span style={styles.icon}>🍦</span>
        <Link style={styles.link} to="/products/desserts">Desserts</Link>
      </div>
      <div style={styles.card}>
        <span style={styles.icon}>💝</span>
        <Link style={styles.link} to="/products/special-events">Special Events</Link>
      </div>
      <div style={styles.card} onClick={() => setShowSubMenu(!showSubMenu)}>
        <span style={styles.icon}>🍣</span>
        <Link style={styles.link}>Hospitality trays{showSubMenu ? '' : ''}</Link>
      </div>

      {showSubMenu && (
        <div style={styles.subMenu}>
          <div style={styles.card}>
          <span style={styles.icon}>🍹</span>
            <Link style={styles.link} to="/products/trays/sweet">Sweet hospitality trays</Link>
          </div>
          <div style={styles.card}>
            <span style={styles.icon}>🍡</span>
            <Link style={styles.link} to="/products/trays/savory">Savory hospitality trays</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
