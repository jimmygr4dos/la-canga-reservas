import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import AdminApp from './admin/AdminApp';
import { UserProvider, useUser } from './UserContext';
import AdminLogin from './admin/AdminLogin'; // ✅ asegúrate que esté bien escrito

const ProtectedAdminRoute = () => {
  const { logueado } = useUser();
  return logueado ? <AdminApp /> : <AdminLogin />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin/*" element={<ProtectedAdminRoute />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>
);

