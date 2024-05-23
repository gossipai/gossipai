import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { CssVarsProvider } from '@mui/joy/styles';
import { CssBaseline } from '@mui/joy';
import Layout from './Layout';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CssVarsProvider defaultMode="dark">
      <CssBaseline />
      <Layout>
        <App />
      </Layout>
    </CssVarsProvider>
  </React.StrictMode>
);
