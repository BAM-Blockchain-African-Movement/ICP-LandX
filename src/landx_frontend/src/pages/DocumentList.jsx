import React, { useState, useEffect } from 'react';
import { landx_backend as AuthBackend } from 'declarations/landx_backend';

const ListDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const result = await AuthBackend.listAllDocuments();
        setDocuments(result);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération des documents:', err);
        setError('Une erreur est survenue lors de la récupération des documents.');
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Liste des Documents</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Nom</th>
            <th className="py-2 px-4 border-b">Hash</th>
            <th className="py-2 px-4 border-b">Date d'upload</th>
            <th className="py-2 px-4 border-b">ID du Titre</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id}>
              <td className="py-2 px-4 border-b">{doc.id}</td>
              <td className="py-2 px-4 border-b">{doc.nom}</td>
              <td className="py-2 px-4 border-b">{doc.hash}</td>
              <td className="py-2 px-4 border-b">{new Date(Number(doc.dateUpload) / 1000000).toLocaleString()}</td>
              <td className="py-2 px-4 border-b">{doc.titreId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListDocuments;