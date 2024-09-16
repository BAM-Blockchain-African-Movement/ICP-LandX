import React from 'react';
import { Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Définition du composant ProtectedRoute
// Il prend en props le composant à rendre (Element) et toutes les autres props de Route
const ProtectedRoute = ({ element: Element, ...rest }) => {
  // Utilisation du hook personnalisé useAuth pour vérifier si l'utilisateur est authentifié
  const { isAuthenticated } = useAuth();
  
  // Utilisation du hook useLocation pour obtenir l'objet location actuel
  const location = useLocation();

  // Rendu conditionnel basé sur l'état d'authentification
  return isAuthenticated ? (
    // Si l'utilisateur est authentifié, on rend le composant Route normal avec l'élément spécifié
    <Route {...rest} element={<Element />} />
  ) : (
    // Si l'utilisateur n'est pas authentifié, on le redirige vers la page de connexion
    <Navigate
      to="/login"  // Redirection vers la page de connexion
      state={{ from: location }}  // On passe l'emplacement actuel dans l'état pour pouvoir y revenir après la connexion
      replace  // Remplace l'entrée actuelle dans l'historique de navigation au lieu d'en ajouter une nouvelle
    />
  );
};

export default ProtectedRoute;