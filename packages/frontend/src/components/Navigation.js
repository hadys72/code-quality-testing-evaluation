import PropTypes from 'prop-types';
// packages/frontend/src/components/Navigation.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { logout } from '../services/api';

const Navigation = ({ onLogout }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    logout();
    onLogout();
    navigate('/login');
  };

  // Emoji stocké en state, choisi UNE fois après le montage
  const [emoji, setEmoji] = React.useState('👋');
  React.useEffect(() => {
    const list = ['👋', '😊', '🌟', '✨'];
    setEmoji(list[Math.floor(Math.random() * list.length)]);
  }, []);

  const greeting = React.useMemo(() => {
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
    return `Good ${timeOfDay}, ${user.firstname || 'User'} ${emoji}`;
  }, [user.firstname, emoji]);

  return (
    <nav
      style={{
        backgroundColor: '#333',
        padding: '10px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <Link to="/users" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>
          Users
        </Link>
        <Link to="/products" style={{ color: 'white', textDecoration: 'none' }}>
          Products
        </Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ color: 'white', marginRight: '20px' }}>{greeting}</span>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

Navigation.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default Navigation;
