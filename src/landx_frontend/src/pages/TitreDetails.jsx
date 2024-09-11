import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { landx_backend as AuthBackend } from 'declarations/landx_backend';

const TitreDetails = () => {
  const { id } = useParams();
  const [titre, setTitre] = useState(null);
  const navigate = useNavigate(); // useNavigate hook for navigation
  useEffect(() => {
    const fetchTitres = async () => {
      try {
        const result = await AuthBackend.getTitres();
        setTitre(result);
      } catch (error) {
        console.error('Erreur lors de la récupération des titres:', error);
      }
    };
    fetchTitres();
  }, []);

  if (!titre) return <div className="text-center">Chargement...</div>;

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6">Détails du Titre {titre.id}</h2>
      <div className="mb-4">
        <p className="text-gray-700 text-sm font-bold mb-2">Localisation:</p>
        <p className="text-gray-700">{titre.localisation}</p>
      </div>
      <div className="mb-4">
        <p className="text-gray-700 text-sm font-bold mb-2">Superficie:</p>
        <p className="text-gray-700">{titre.superficie} m²</p>
      </div>
      <div className="mb-4">
        <p className="text-gray-700 text-sm font-bold mb-2">Propriétaire:</p>
        <p className="text-gray-700">{titre.proprietaire}</p>
      </div>
      <div className="mb-4">
        <p className="text-gray-700 text-sm font-bold mb-2">Statut:</p>
        <p className="text-gray-700">{titre.statut}</p>
      </div>
      <button
        onClick={() => navigate(-1)} // useNavigate to go back
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Retour
      </button>
    </div>
  );
};

export default TitreDetails;
