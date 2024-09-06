import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';

const Header= () => {
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    setUser(null);
    // Add any additional logout logic here (e.g., clearing local storage, calling logout API)
  };

  return (
    <header className="bg-yellow-600 text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">LandX</Link>
          <nav>
            <ul className="flex space-x-4">
              <li><Link to="/" className="hover:text-yellow-200">Accueil</Link></li>
              <li><Link to="/services" className="hover:text-yellow-200">Services</Link></li>
              <li><Link to="/about" className="hover:text-yellow-200">À Propos</Link></li>
              <li><Link to="/contact" className="hover:text-yellow-200">Contact</Link></li>
              {user ? (
                <>
                  <li><Link to="/dashboard" className="hover:text-yellow-200">Tableau de Bord</Link></li>
                  <li><button onClick={handleLogout} className="hover:text-yellow-200">Déconnexion</button></li>
                </>
              ) : (
                <li><Link to="/login" className="hover:text-yellow-200">Connexion</Link></li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;