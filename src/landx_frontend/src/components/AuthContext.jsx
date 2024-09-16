import React, { createContext, useState, useContext, useEffect } from 'react';
import { landx_backend as AuthBackend } from 'declarations/landx_backend';

// Création d'un contexte pour l'authentification
const AuthContext = createContext(null);

// Composant AuthProvider qui gère l'état de l'authentification
export const AuthProvider = ({ children }) => {
  // État pour stocker les informations de l'utilisateur connecté
  const [user, setUser] = useState(null);

  // Effet qui vérifie l'état de l'authentification au chargement du composant
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Fonction pour vérifier l'état de l'authentification
  const checkAuthStatus = async () => {
    try {
      const userInfo = await AuthBackend.getUserInfo();
      if (userInfo) {
        setUser(userInfo);
      } else {
        setUser(null); // S'assure que l'état de l'utilisateur est effacé si aucune information n'est trouvée
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'état de connexion:", error);
    }
  };

  // Fonction pour gérer la connexion de l'utilisateur
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

  // Fonction pour gérer la déconnexion de l'utilisateur
  const logout = async () => {
    try {
      // Effectue le nettoyage nécessaire sur le backend, si applicable
      // Actuellement, nous n'avons pas de fonction de déconnexion backend, donc nous effaçons uniquement l'état local

      // Efface l'état de l'utilisateur
      setUser(null);

      // Optionnellement, vous pourriez effacer les tokens ou d'autres données d'authentification du stockage local
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');

      // Optionnellement, naviguez vers la page de connexion ou la page d'accueil
      // Par exemple, en utilisant useNavigate de react-router-dom (assurez-vous de l'utiliser dans un composant)
      // navigate('/login');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  // Fonction pour vérifier si l'utilisateur a des droits d'administrateur
  const hasAdminAccess = () => {
    return user && user.role === 1;
  };

  // Fournit le contexte d'authentification aux composants enfants
  return (
    <AuthContext.Provider value={{ user, login, logout, checkAuthStatus, hasAdminAccess }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);