import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
// import { land_management as AuthBackend } from 'declarations/land_management';
import { landx_backend as AuthBackend } from 'declarations/landx_backend';

const TerrainManagement = () => {
    const { user } = useAuth();
    const [titres, setTitres] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [nouveauTerrain, setNouveauTerrain] = useState({
        localisation: '',
        superficie: 0,
        latitude: 0,
        longitude: 0,
        gpsCoordinates: []
    });

    useEffect(() => {
        fetchTitres();
        fetchTransactions();
    }, []);

    const fetchTitres = async () => {
        const result = await AuthBackend.getTitres();
        setTitres(result);
    };

    const fetchTransactions = async () => {
        const result = await AuthBackend.getTransactions();
        setTransactions(result);
    };

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
            fetchTitres();
            setNouveauTerrain({
                localisation: '',
                superficie: 0,
                latitude: 0,
                longitude: 0,
                gpsCoordinates: []
            });
        } catch (error) {
            console.error("Erreur lors de la création du titre :", error);
        }
    };

    const handleAchat = async (titreId) => {
        try {
            const success = await AuthBackend.acheterTerrain(titreId);
            if (success) {
                fetchTitres();
                fetchTransactions();
            } else {
                alert("L'achat n'a pas pu être effectué.");
            }
        } catch (error) {
            console.error("Erreur lors de l'achat du terrain :", error);
        }
    };

    const genererTitreFoncier = async (titreId) => {
        try {
            const titreFoncier = await AuthBackend.genererTitreFoncier(titreId);
            if (titreFoncier) {
                alert(titreFoncier);
            } else {
                alert("Impossible de générer le titre foncier.");
            }
        } catch (error) {
            console.error("Erreur lors de la génération du titre foncier :", error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Gestion des Terrains</h1>
            
            <form onSubmit={handleSubmit} className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Enregistrer un nouveau terrain</h2>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="localisation"
                        value={nouveauTerrain.localisation}
                        onChange={handleInputChange}
                        placeholder="Localisation"
                        className="border p-2 rounded"
                    />
                    <input
                        type="number"
                        name="superficie"
                        value={nouveauTerrain.superficie}
                        onChange={handleInputChange}
                        placeholder="Superficie (m²)"
                        className="border p-2 rounded"
                    />
                    <input
                        type="number"
                        name="latitude"
                        value={nouveauTerrain.latitude}
                        onChange={handleInputChange}
                        placeholder="Latitude"
                        className="border p-2 rounded"
                    />
                    <input
                        type="number"
                        name="longitude"
                        value={nouveauTerrain.longitude}
                        onChange={handleInputChange}
                        placeholder="Longitude"
                        className="border p-2 rounded"
                    />
                    <input
                        type="text"
                        name="gpsCoordinates"
                        value={nouveauTerrain.gpsCoordinates}
                        onChange={handleInputChange}
                        placeholder="Coordonnées GPS (séparées par des virgules)"
                        className="border p-2 rounded col-span-2"
                    />
                </div>
                <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">Enregistrer le terrain</button>
            </form>

            <h2 className="text-xl font-semibold mb-2">Terrains disponibles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {titres.map(titre => (
                    <div key={titre.id} className="border p-4 rounded shadow">
                        <h3 className="font-bold">{titre.localisation}</h3>
                        <p>Superficie: {titre.superficie} m²</p>
                        <p>Propriétaire: {titre.proprietaire.toText().slice(0, 10)}...</p>
                        <p>Statut: {titre.statut}</p>
                        {user && user.principal !== titre.proprietaire && (
                            <button
                                onClick={() => handleAchat(titre.id)}
                                className="mt-2 bg-green-500 text-white p-2 rounded"
                            >
                                Acheter
                            </button>
                        )}
                        <button
                            onClick={() => genererTitreFoncier(titre.id)}
                            className="mt-2 ml-2 bg-yellow-500 text-white p-2 rounded"
                        >
                            Générer Titre Foncier
                        </button>
                    </div>
                ))}
            </div>

            <h2 className="text-xl font-semibold mt-8 mb-2">Transactions récentes</h2>
            <ul>
                {transactions.map(transaction => (
                    <li key={transaction.id} className="mb-2">
                        Terrain #{transaction.titreId} - 
                        Vendeur: {transaction.vendeur.toText().slice(0, 10)}... - 
                        Acheteur: {transaction.acheteur.toText().slice(0, 10)}... - 
                        Statut: {transaction.statut}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TerrainManagement;