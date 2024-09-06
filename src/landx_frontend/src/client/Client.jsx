import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './Auth/AuthContext';
import AuthPage from '../pages/AuthPage';
import UserList from '../pages/UserList';

const ClientDashboard= () => {
  const { user, setUser } = useContext(AuthContext);
  const [showAuth, setShowAuth] = useState(!user);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setShowAuth(false);
  };

  if (showAuth) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Bienvenue sur LandX</h1>
        <AuthPage onSubmit={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord client</h1>
      <nav className="mb-8">
        <ul className="flex space-x-4">
          <li><Link to="/client/lands" className="text-yellow-700 hover:underline">Voir les terrains</Link></li>
          <li><Link to="/client/buy" className="text-yellow-700 hover:underline">Acheter un terrain</Link></li>
          <li><button onClick={() => setUser(null)} className="text-red-500 hover:underline">Déconnexion</button></li>
        </ul>
      </nav>
      {/* <LandList /> */}
      <UserList/>
    </div>
  );
};

export default ClientDashboard;