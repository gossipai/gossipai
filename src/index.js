import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

import { CssVarsProvider } from '@mui/joy/styles';
import { CssBaseline } from '@mui/joy';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CssVarsProvider defaultMode="dark">
      <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
    </CssVarsProvider>
  </React.StrictMode>
);
