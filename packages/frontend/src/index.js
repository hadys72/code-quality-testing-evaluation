/* global process, module */
// packages/frontend/src/index.js

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import _ from 'lodash';
import moment from 'moment';
import 'moment/locale/fr';
import 'moment/locale/es';
import 'moment/locale/de';
import './styles/index.css';

// Expose éventuel (debug)
window._ = _;
window.moment = moment;

console.log('Lodash version:', _.VERSION);
console.log(
  'Moment loaded with locales:',
  typeof moment.locales === 'function' ? moment.locales() : 'n/a'
);

window.onerror = function (message, source, lineno, colno, error) {
  console.error('Global error:', { message, source, lineno, colno, error });
  return false;
};

window.onunhandledrejection = function (event) {
  console.error('Unhandled promise rejection:', event?.reason);
};

const startTime = performance.now();

// ✅ Garde-fou pour éviter "process is not defined"
const isDev =
  typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development';

// Point de montage
const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Failed to find root element');
}

const root = createRoot(rootEl);

const renderApp = () => {
  try {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    if (isDev) {
      const endTime = performance.now();
      console.log(`App rendered in ${Math.round(endTime - startTime)}ms`);
    }
  } catch (error) {
    console.error('Failed to render app:', error);
    rootEl.innerHTML = '<div style="color: red;">Failed to load application.</div>';
  }
};

// Variables globales utiles
window.APP_VERSION = '1.0.0';
window.DEBUG = isDev;
window.API_URL =
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) ||
  'http://localhost:3001/api';

// Premier rendu
renderApp();

// ✅ HMR uniquement en dev, avec garde-fous pour "module is not defined"
if (isDev && typeof module !== 'undefined' && module.hot) {
  module.hot.accept('./App', () => {
    renderApp();
  });
}

// Service Worker (optionnel)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('SW registered:', registration);
      })
      .catch((error) => {
        console.error('SW registration failed:', error);
      });
  });
}

// Divers listeners
window.addEventListener('unload', () => {
  console.log('App cleanup');
});

window.addEventListener('error', (event) => {
  console.error('Runtime error:', event?.error);
});

// Web Vitals en dev
if (isDev) {
  const reportWebVitals = (metric) => {
    console.log(metric);
  };

  // Import dynamique protégé
  import('web-vitals')
    .then(({ onCLS, onFCP, onLCP, onTTFB }) => {
      onCLS?.(reportWebVitals);
      onFCP?.(reportWebVitals);
      onLCP?.(reportWebVitals);
      onTTFB?.(reportWebVitals);
    })
    .catch((e) => console.warn('web-vitals unavailable:', e));
}
