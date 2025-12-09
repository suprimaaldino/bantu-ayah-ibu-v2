import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import './index.css';
import { NameProvider } from './context/NameContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <NameProvider>
        <App />
      </NameProvider>
    </HelmetProvider>
  </React.StrictMode>
);