import React, { createContext, useState, useContext, useEffect } from 'react';
import { landx_backend as AuthBackend } from 'declarations/landx_backend';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userInfo = await AuthBackend.getUserInfo();
      if (userInfo) {
        setUser(userInfo);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'état de connexion:", error);
    }
  };

  const login = async (email, password) => {
    const success = await AuthBackend.login(email, password);
    if (success) {
      await checkAuthStatus(); // Récupère les informations de l'utilisateur, y compris le rôle
    }
    return success;
  };

  const logout = async () => {
    setUser(null);
  };

  const hasAdminAccess = () => {
    return user && user.role === 1;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, checkAuthStatus, hasAdminAccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);