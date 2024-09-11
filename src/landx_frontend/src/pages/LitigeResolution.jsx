import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { landx_backend as AuthBackend } from 'declarations/landx_backend';


const LitigeResolution = () => {
  const { id } = useParams(); // useParams to access route parameters
  const [resolution, setResolution] = useState('');
  const navigate = useNavigate(); // useNavigate hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await AuthBackend.resoudreLitige(Number(id), resolution);
      if (result.ok) {
        alert('Litige résolu avec succès !');
        navigate('/dashboard/litiges'); // useNavigate for navigation
      } else {
        alert(`Erreur: ${result.err}`);
      }
    } catch (error) {
      console.error('Erreur lors de la résolution du litige:', error);
      alert('Une erreur est survenue lors de la résolution du litige');
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6">Résolution du Litige {id}</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="resolution">
            Résolution du litige
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="resolution"
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            rows="4"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Résoudre le litige
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

export default LitigeResolution;
