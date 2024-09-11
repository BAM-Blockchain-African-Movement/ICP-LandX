import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { landx_backend as AuthBackend } from 'declarations/landx_backend';

const DocumentUpload = () => {
  const { titreId } = useParams();
  const navigate = useNavigate();
  const [nomDoc, setNomDoc] = useState('');
  const [hashDoc, setHashDoc] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await AuthBackend.ajouterDocument(Number(titreId), nomDoc, hashDoc);
      if (result.ok) {
        alert('Document ajouté avec succès !');
        navigate(`/dashboard/titres/${titreId}/documents`);
      } else {
        alert(`Erreur: ${result.err}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du document:', error);
      alert('Une erreur est survenue lors de l\'ajout du document');
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6">Ajouter un document au titre {titreId}</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nomDoc">
            Nom du document
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="nomDoc"
            type="text"
            value={nomDoc}
            onChange={(e) => setNomDoc(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hashDoc">
            Hash du document
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="hashDoc"
            type="text"
            value={hashDoc}
            onChange={(e) => setHashDoc(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Ajouter le document
          </button>
          <button
            onClick={() => navigate(-1)}
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

export default DocumentUpload;
