import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import logo from '../assets/LandX.jpg'; // Assurez-vous que le chemin est correct

const Header = () => {
  const { user, logout, hasAdminAccess } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Clear authentication token or session info
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  
    // Redirect or update UI
    window.location.href = '/login'; // Or use react-router's useNavigate()
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