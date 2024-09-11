import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { landx_backend as AuthBackend } from 'declarations/landx_backend';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TitreVerification = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proofType, setProofType] = useState('');
  const [proofHash, setProofHash] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await AuthBackend.verifierTitre(Number(id), proofType, proofHash);
      if ('ok' in result) {
        toast.success(result.ok);
        setTimeout(() => navigate('/dashboard/titres'), 2000);
      } else {
        toast.error(`Erreur: ${result.err}`);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du titre:', error);
      toast.error('Une erreur est survenue lors de la vérification du titre');
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6">Vérification du Titre {id}</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="proofType">
            Type de preuve
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="proofType"
            type="text"
            value={proofType}
            onChange={(e) => setProofType(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="proofHash">
            Hash de la preuve
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="proofHash"
            type="text"
            value={proofHash}
            onChange={(e) => setProofHash(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Vérifier le titre
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
      <ToastContainer />
    </div>
  );
};

export default TitreVerification;