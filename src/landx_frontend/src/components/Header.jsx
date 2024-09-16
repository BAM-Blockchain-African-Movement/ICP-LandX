import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import logo from '../assets/LandX.jpg'; // Assurez-vous que le chemin est correct

const Header = () => {
  // Utilisation du hook personnalisé useAuth pour accéder aux fonctions d'authentification
  const { user, logout, hasAdminAccess } = useAuth();

   // Hook de navigation de React Router
  const navigate = useNavigate();

   // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
  
    // Suppression des tokens d'authentification du stockage local
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  
    // Redirection vers la page de connexion
    navigate('/login');
  };

  return (
    <header className="bg-blue-500 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="LandX Logo" className="h-10 mr-2" />
          <span className="font-bold text-xl">LandX</span>
        </Link>
        <ul className="flex space-x-4">
          <li><Link to="/" className="hover:text-yellow-200">Accueil</Link></li>
          <li><Link to="/services" className="hover:text-yellow-200">Services</Link></li>
          <li><Link to="/about" className="hover:text-yellow-200">À Propos</Link></li>
          <li><Link to="/contact" className="hover:text-yellow-200">Contact</Link></li>
          <li><Link to="/terrain-management" className="hover:text-yellow-200">Gestion des terrains</Link></li>
          <li><Link to="/dashboard" className="hover:text-yellow-200">Tableau de Bord</Link></li>
          {user ? (
            <>
              {hasAdminAccess() && (
                <li><Link to="/dashboard" className="hover:text-yellow-200">Tableau de Bord</Link></li>
              )}
              <li><button onClick={handleLogout} className="hover:text-yellow-200">Déconnexion</button></li>
            </>
          ) : (
            <li><Link to="/login" className="hover:text-yellow-200">Connexion</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;