import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { landx_backend as AuthBackend } from 'declarations/landx_backend';


const TitreList = () => {
  const [titres, setTitres] = useState([]);

  useEffect(() => {
    const fetchTitres = async () => {
      try {
        const result = await AuthBackend.getTitres();
        setTitres(result);
      } catch (error) {
        console.error('Erreur lors de la récupération des titres:', error);
      }
    };
    fetchTitres();
  }, []);

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6">Liste des Titres</h2>
      <Link to="/dashboard/titres/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">
        Créer un nouveau titre
      </Link>
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              ID
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Localisation
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Superficie
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {titres.map(titre => (
            <tr key={titre.id}>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {titre.id}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {titre.localisation}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {titre.superficie} m²
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <Link to={`/dashboard/titres/${titre.id}/details`} className="text-blue-600 hover:text-blue-900 mr-2">
                  Détails
                </Link>
                <Link to={`/dashboard/titres/${titre.id}/verify`} className="text-green-600 hover:text-green-900 mr-2">
                  Vérifier
                </Link>
                <Link to={`/dashboard/titres/${titre.id}/transfer`} className="text-purple-600 hover:text-purple-900">
                  Transférer
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TitreList;