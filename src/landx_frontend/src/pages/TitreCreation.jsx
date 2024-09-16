import React, { useState } from 'react';
import { landx_backend as AuthBackend } from 'declarations/landx_backend';
import { toast, ToastContainer } from 'react-toastify';

const TitreCreation = () => {
  const [nouveauTerrain, setNouveauTerrain] = useState({
    localisation: '',
    superficie: '',
    latitude: '',
    longitude: '',
    gpsCoordinates: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNouveauTerrain(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AuthBackend.createTitre(
        nouveauTerrain.localisation,
        Number(nouveauTerrain.superficie),
        { latitude: Number(nouveauTerrain.latitude), longitude: Number(nouveauTerrain.longitude) },
        nouveauTerrain.gpsCoordinates.split(',').map(Number)
      );
      // message de success
      toast.success('Titre créé avec succès!');
      // renitialise les valeurs du formulaire
      setNouveauTerrain({
        localisation: '',
        superficie: '',
        latitude: '',
        longitude: '',
        gpsCoordinates: ''
      });
    } catch (error) {
      console.error("Erreur lors de la création du titre :", error);
      // Show error toast
      toast.error('Erreur lors de la création du titre.');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Créer un nouveau titre</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Localisation</label>
          <input
            type="text"
            name="localisation"
            value={nouveauTerrain.localisation}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Superficie (m²)</label>
          <input
            type="number"
            name="superficie"
            value={nouveauTerrain.superficie}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Latitude</label>
          <input
            type="number"
            name="latitude"
            value={nouveauTerrain.latitude}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Longitude</label>
          <input
            type="number"
            name="longitude"
            value={nouveauTerrain.longitude}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Coordonnées GPS (séparées par des virgules)</label>
          <input
            type="text"
            name="gpsCoordinates"
            value={nouveauTerrain.gpsCoordinates}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Créer le titre
        </button>
      </form>
      <ToastContainer /> {/* This is where the toasts will appear */}
    </div>
  );
};

export default TitreCreation;
