import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { landx_backend as AuthBackend } from 'declarations/landx_backend';

const TitreTransfer = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // useNavigate hook for navigation
  const [nouveauProprietaire, setNouveauProprietaire] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await AuthBackend.transfererTitre(Number(id), nouveauProprietaire);
      if (result.ok) {
        alert('Titre transféré avec succès !');
        navigate('/dashboard/titres'); // useNavigate to navigate
      } else {
        alert(`Erreur: ${result.err}`);
      }
    } catch (error) {
      console.error('Erreur lors du transfert du titre:', error);
      alert('Une erreur est survenue lors du transfert du titre');
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6">Transfert du Titre {id}</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nouveauProprietaire">
            ID du nouveau propriétaire
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="nouveauProprietaire"
            type="text"
            value={nouveauProprietaire}
            onChange={(e) => setNouveauProprietaire(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Transférer le titre
          </button>
          <button
            onClick={() => navigate(-1)} // useNavigate to go back
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default TitreTransfer;
