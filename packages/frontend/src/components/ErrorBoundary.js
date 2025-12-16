import PropTypes from 'prop-types';
// packages/frontend/src/components/ErrorBoundary.js
import React from 'react';

/**
 * Composant ErrorBoundary :
 * Permet d'éviter qu'une erreur JavaScript dans un composant enfant
 * ne fasse planter toute l'application.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // Si une erreur est capturée, on met à jour l'état
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // Optionnel : permet de logguer l'erreur
  componentDidCatch(error, info) {
    // Tu peux envoyer l'erreur à un service externe si besoin
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            backgroundColor: '#fee',
            color: '#900',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <h2>Something went wrong.</h2>
          <p>Please refresh the page or try again later.</p>
        </div>
      );
    }

    // Si pas d’erreur, on affiche les enfants normalement
    return this.props.children;
  }
}

// ✅ Validation des props
ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
