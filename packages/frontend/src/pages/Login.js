// packages/frontend/src/pages/Login.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';

/**
 * Page de connexion utilisateur.
 * Permet à un utilisateur de se connecter avec nom d'utilisateur et mot de passe.
 */
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(username, password);
      onLogin?.(); // ✅ safe call au cas où onLogin n’est pas passé
      navigate('/products');
    } catch (err) {
      // ✅ Utilisation de guillemets doubles pour éviter l’erreur ESLint de parsing
      setError(err.error || "An error occurred. Please check that you haven't made a mistake.");
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        borderRadius: '8px',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>

      {error && (
        <div
          style={{
            color: 'red',
            marginBottom: '10px',
            padding: '10px',
            backgroundColor: '#ffebee',
            borderRadius: '4px',
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
        }}
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
          }}
        />

        <button
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Login
        </button>
      </form>

      <p
        style={{
          textAlign: 'center',
          marginTop: '20px',
        }}
      >
        {/* ✅ Apostrophe échappée pour éviter react/no-unescaped-entities */}
        Don&apos;t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

// ✅ Validation des props
Login.propTypes = {
  onLogin: PropTypes.func,
};

export default Login;
