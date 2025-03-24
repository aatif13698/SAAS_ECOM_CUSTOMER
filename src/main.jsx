import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import '@coreui/coreui/dist/css/coreui.min.css'
import { Toaster } from 'react-hot-toast';



import App from './App.jsx';
import './index.css';

import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";

import store, { persistor } from './store/index.js';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <Provider store={store}>
        {/* Pass the persistor prop here */}
        <PersistGate loading={null} persistor={persistor}>
          <App />
          <Toaster />
        </PersistGate>
      </Provider>
    </BrowserRouter>
);
