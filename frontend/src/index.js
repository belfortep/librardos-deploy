import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId='57668175012-69agc306pe775uoc5t2f4s87kekrta36.apps.googleusercontent.com'>
    <React.StrictMode>
      <AuthContextProvider>
      <App />
      </AuthContextProvider>
    </React.StrictMode>
  </GoogleOAuthProvider>
);


