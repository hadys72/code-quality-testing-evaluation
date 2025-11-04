// packages/frontend/src/hooks/useAuth.js
import React from 'react';

/**
 * Hook personnalisé useAuth :
 * Gère l'authentification de l'utilisateur (connexion, déconnexion, persistance).
 */
export function useAuth() {
  // ✅ Initialise directement l'utilisateur depuis le localStorage (pas de setState dans un useEffect)
  const [user, setUser] = React.useState(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    return token && userData ? JSON.parse(userData) : null;
  });

  const [loading, setLoading] = React.useState(false);

  // Simple effet pour marquer le chargement terminé (peut servir à afficher un spinner)
  React.useEffect(() => {
    setLoading(false);
  }, []);

  // ✅ Connexion : enregistre les infos utilisateur dans le localStorage
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // ✅ Déconnexion : supprime les infos du localStorage
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return { user, loading, login, logout };
}
