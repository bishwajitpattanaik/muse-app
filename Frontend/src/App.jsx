import { useState, useEffect } from "react";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import { AuthContext } from "./context/AuthContext";

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("muse_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("muse_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("muse_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {user ? <Dashboard /> : <AuthPage />}
    </AuthContext.Provider>
  );
}
