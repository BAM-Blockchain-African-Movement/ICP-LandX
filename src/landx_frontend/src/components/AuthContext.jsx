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
      } else {
        setUser(null); // Ensure user state is cleared if no user info is found
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'état de connexion:", error);
    }
  };

  const login = async (email, password) => {
    try {
      const success = await AuthBackend.login(email, password);
      if (success) {
        await checkAuthStatus(); // Récupère les informations de l'utilisateur, y compris le rôle
      }
      return success;
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Perform any necessary cleanup on the backend, if applicable
      // Currently, we do not have a backend logout function, so we only clear local state

      // Clear user state
      setUser(null);

      // Optionally, you could clear tokens or other authentication-related data from local storage
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');

      // Optionally, navigate to login page or home page
      // For example, using react-router-dom's useNavigate (make sure to use it in a component)
      // navigate('/login');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
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
