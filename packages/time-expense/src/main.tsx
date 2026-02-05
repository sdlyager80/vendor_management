import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { DxcProvider } from '@dxc-technology/halstack-react';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <DxcProvider>
        <App />
      </DxcProvider>
    </BrowserRouter>
  </React.StrictMode>
);
