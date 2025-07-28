import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Events from "./components/Events";
import Users from "./components/Users";
import Tickets from "./components/Tickets";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";

import "./App.css";

function App() {
  const [token, setToken] = useState(null);

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        {/* Giriş ekranı */}
        <Route
          path="/login"
          element={
            token ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
          }
        />

        {/* Korunan admin sayfaları */}
        <Route
          path="/*"
          element={
            token ? (
              <div className="admin-container">
                <Sidebar onLogout={handleLogout} />
                <main className="content">
                  <Routes>
                    <Route path="/" element={<Dashboard token={token} />} />
                    <Route path="/events" element={<Events token={token} />} />
                    <Route path="/users" element={<Users token={token} />} />
                    <Route path="/tickets" element={<Tickets token={token} />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </main>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
