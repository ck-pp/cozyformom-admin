/* src/App.tsx */

import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login/Login.tsx';
import AdminPage from './pages/Admin/Admin.tsx';
import PrivateRoute from './PrivateRoute.tsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<LoginPage />} /> */}
        <Route path="/" element={<LoginPage />} />

        {/* "/admin/*" → PrivateRoute(로그인 필요) */}
        <Route 
          path="/admin/*" 
          element={
            <PrivateRoute>
              <AdminPage />
            </PrivateRoute>
          } 
        />

        {/* 기타 */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;