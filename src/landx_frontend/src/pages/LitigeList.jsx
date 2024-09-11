import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { landx_backend as AuthBackend } from 'declarations/landx_backend';

const LitigeList = () => {
  const [litiges, setLitiges] = useState([]);

  useEffect(() => {
    const fetchLitiges = async () => {
      try {
        const result = await AuthBackend.getLitiges();
        if (result.ok) {
          setLitiges(result.ok);
        } else {
          console.error('Erreur lors de la récupération des litiges:', result.err);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des litiges:', error);
      }
    };

    fetchLitiges();
  }, []);

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6">Liste des Litiges</h2>
      <Link to="/dashboard/litiges/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">
        Créer un nouveau litige
      </Link>
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              ID
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Titre ID
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {litiges.map(litige => (
            <tr key={litige.id}>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {litige.id}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {litige.titreId}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {litige.statut}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <Link to={`/dashboard/litiges/${litige.id}/resolve`} className="text-blue-600 hover:text-blue-900">
                  Résoudre
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LitigeList;