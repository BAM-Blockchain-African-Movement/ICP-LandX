import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
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
        <div className="min-h-screen bg-gradient-to-b from-amber-100 to-yellow-200 p-8">
            <div className="container mx-auto bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-8 text-yellow-800">Gestion des Terrains</h1>
                
                <form onSubmit={handleSubmit} className="mb-12 bg-yellow-50 p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-semibold mb-4 text-yellow-700">Enregistrer un nouveau terrain</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="localisation"
                            value={nouveauTerrain.localisation}
                            onChange={handleInputChange}
                            placeholder="Localisation"
                            className="border p-2 rounded focus:outline-none focus:border-yellow-500"
                        />
                        <input
                            type="number"
                            name="superficie"
                            value={nouveauTerrain.superficie}
                            onChange={handleInputChange}
                            placeholder="Superficie (m²)"
                            className="border p-2 rounded focus:outline-none focus:border-yellow-500"
                        />
                        <input
                            type="number"
                            name="latitude"
                            value={nouveauTerrain.latitude}
                            onChange={handleInputChange}
                            placeholder="Latitude"
                            className="border p-2 rounded focus:outline-none focus:border-yellow-500"
                        />
                        <input
                            type="number"
                            name="longitude"
                            value={nouveauTerrain.longitude}
                            onChange={handleInputChange}
                            placeholder="Longitude"
                            className="border p-2 rounded focus:outline-none focus:border-yellow-500"
                        />
                        <input
                            type="text"
                            name="gpsCoordinates"
                            value={nouveauTerrain.gpsCoordinates}
                            onChange={handleInputChange}
                            placeholder="Coordonnées GPS (séparées par des virgules)"
                            className="border p-2 rounded col-span-2 focus:outline-none focus:border-yellow-500"
                        />
                    </div>
                    <button type="submit" className="mt-4 bg-yellow-600 text-white p-2 rounded hover:bg-yellow-700 transition duration-300">
                        Enregistrer le terrain
                    </button>
                </form>

                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-yellow-800">Terrains disponibles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {titres.map(titre => (
                            <div key={titre.id} className="bg-white border border-yellow-200 p-4 rounded-lg shadow-md">
                                <h3 className="font-bold text-yellow-800">{titre.localisation}</h3>
                                <p className="text-yellow-700">Superficie: {titre.superficie} m²</p>
                                <p className="text-yellow-700">Propriétaire: {titre.proprietaire.toText().slice(0, 10)}...</p>
                                <p className="text-yellow-700">Statut: {titre.statut}</p>
                                {user && user.principal !== titre.proprietaire && (
                                    <button
                                        onClick={() => handleAchat(titre.id)}
                                        className="mt-2 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300"
                                    >
                                        Acheter
                                    </button>
                                )}
                                <button
                                    onClick={() => genererTitreFoncier(titre.id)}
                                    className="mt-2 ml-2 bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition duration-300"
                                >
                                    Générer Titre Foncier
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12">
                    <h2 className="text-2xl font-semibold mb-4 text-yellow-800">Transactions récentes</h2>
                    <ul className="bg-white border border-yellow-200 rounded-lg shadow-md p-4">
                        {transactions.map(transaction => (
                            <li key={transaction.id} className="mb-2 text-yellow-700">
                                Terrain #{transaction.titreId} - 
                                Vendeur: {transaction.vendeur.toText().slice(0, 10)}... - 
                                Acheteur: {transaction.acheteur.toText().slice(0, 10)}... - 
                                Statut: {transaction.statut}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TerrainManagement;