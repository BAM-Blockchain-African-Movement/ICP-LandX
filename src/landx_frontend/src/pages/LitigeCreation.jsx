import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { landx_backend as AuthBackend } from 'declarations/landx_backend';

const LitigeCreation = () => {
  const [titreId, setTitreId] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate(); // useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await AuthBackend.creerLitige(Number(titreId), description);
      if (result.ok) {
        alert('Litige créé avec succès !');
        navigate('/dashboard/litiges'); // useNavigate for navigation
      } else {
        alert(`Erreur: ${result.err}`);
      }
    } catch (error) {
      console.error('Erreur lors de la création du litige:', error);
      alert('Une erreur est survenue lors de la création du litige');
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6">Créer un nouveau litige</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="titreId">
            ID du titre concerné
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="titreId"
            type="number"
            value={titreId}
            onChange={(e) => setTitreId(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description du litige
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Créer le litige
          </button>
          <button
            onClick={() => navigate(-1)} // useNavigate for navigation
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

export default LitigeCreation;
