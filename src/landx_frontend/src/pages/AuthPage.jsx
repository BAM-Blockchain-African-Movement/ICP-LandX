import React, { useState } from 'react';
import {api} from '../../../service/api'
const AuthPage = ({ onSubmit }) => {
  // État pour les données du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    role: 'Acheteur',
    dateNaissance: '',
    pieceIdentite: '',
    adresse: '',
    telephone: '',
    email: '',
    capaciteFinanciere: '',
  });

  // État pour gérer l'affichage du formulaire de connexion ou d'inscription
  const [isLogin, setIsLogin] = useState(true);

  // Fonction pour gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Logique de connexion
        const user = await api.verifierUtilisateur(formData.email, formData.pieceIdentite);
        if (user) {
          onSubmit(user);
        } else {
          console.error("Utilisateur non trouvé ou informations incorrectes");
        }
      } else {
        // Logique d'inscription
        const result = await api.creerUtilisateur(
          formData.nom,
          formData.role,
          formData.dateNaissance,
          formData.pieceIdentite,
          formData.adresse,
          formData.telephone,
          formData.email
        );
        if (result.ok) {
          if (formData.role === 'Acheteur') {
            await api.ajouterCapaciteFinanciere(formData.capaciteFinanciere);
          }
          const user = await api.verifierUtilisateur();
          onSubmit(user);
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'authentification:", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {isLogin ? 'Connexion' : 'Inscription'}
      </h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {!isLogin && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nom">
                Nom complet
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="nom"
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                Rôle
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="Proprietaire">Propriétaire</option>
                <option value="Acheteur">Acheteur</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateNaissance">
                Date de naissance
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="dateNaissance"
                type="date"
                name="dateNaissance"
                value={formData.dateNaissance}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="adresse">
                Adresse
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="adresse"
                type="text"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telephone">
                Téléphone
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="telephone"
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pieceIdentite">
            Numéro de pièce d'identité
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="pieceIdentite"
            type="text"
            name="pieceIdentite"
            value={formData.pieceIdentite}
            onChange={handleChange}
            required
          />
        </div>
        {!isLogin && formData.role === 'Acheteur' && (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="capaciteFinanciere">
              Capacité financière
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="capaciteFinanciere"
              type="text"
              name="capaciteFinanciere"
              value={formData.capaciteFinanciere}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {isLogin ? 'Se connecter' : 'S\'inscrire'}
          </button>
          <button
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            type="button"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Créer un compte' : 'Déjà un compte ?'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthPage;
