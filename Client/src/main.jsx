import React from 'react'
// import { PageParamsProvider } from './contexts/PageParams.jsx';
import { UserProvider } from './contexts/UserContext';
import { PopupProvider } from './contexts/PopUpContext';
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserProvider>
    <PopupProvider>
      <App />
    </PopupProvider>
  </UserProvider>
);
