import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { idlFactory } from "../declarations/landx_backend";

// Création de l'acteur
const agent = new HttpAgent();
const titreFoncierActor = Actor.createActor(idlFactory, { 
  agent, 
  canisterId: process.env.CANISTER_ID_LANDX_BACKEND 
});

export const api = {
  // Gestion des utilisateurs
  creerUtilisateur: async (nom, dateNaissance, pieceIdentite, adresse, telephone, email, role, capaciteFinanciere) => {
    return await titreFoncierActor.creerUtilisateur(nom, dateNaissance, pieceIdentite, adresse, telephone, email, role, capaciteFinanciere);
  },

  mettreAJourUtilisateur: async (nom, dateNaissance, pieceIdentite, adresse, telephone, email, capaciteFinanciere) => {
    return await titreFoncierActor.mettreAJourUtilisateur(nom, dateNaissance, pieceIdentite, adresse, telephone, email, capaciteFinanciere);
  },

  verifierUtilisateur: async () => {
    return await titreFoncierActor.verifierUtilisateur();
  },

  // Gestion des titres
  creerTitre: async (localisation, superficie, lat, long, gpsCoords) => {
    return await titreFoncierActor.creerTitre(localisation, superficie, lat, long, gpsCoords);
  },

  verifierTitre: async (titreId, proofType, proofHash) => {
    return await titreFoncierActor.verifierTitre(titreId, proofType, proofHash);
  },

  contesterTitre: async (titreId, raison) => {
    return await titreFoncierActor.contesterTitre(titreId, raison);
  },

  transfererTitre: async (id, nouveauProprietaire) => {
    return await titreFoncierActor.transfererTitre(id, nouveauProprietaire);
  },

  validerTransfert: async (transactionId) => {
    return await titreFoncierActor.validerTransfert(transactionId);
  },

  ajouterDocument: async (titreId, nomDoc, hashDoc) => {
    return await titreFoncierActor.ajouterDocument(titreId, nomDoc, hashDoc);
  },

  getTitre: async (id) => {
    return await titreFoncierActor.getTitre(id);
  },

  getAllTitres: async () => {
    return await titreFoncierActor.getAllTitres();
  },

  // Gestion des litiges
  creerLitige: async (titreId, description) => {
    return await titreFoncierActor.creerLitige(titreId, description);
  },

  resoudreLitige: async (litigeId, resolution) => {
    return await titreFoncierActor.resoudreLitige(litigeId, resolution);
  },

  getLitiges: async () => {
    return await titreFoncierActor.getLitiges();
  },

  // Autres fonctionnalités
  getTransactions: async (titreId) => {
    return await titreFoncierActor.getTransactions(titreId);
  },

  getVerificationHistoire: async (titreId) => {
    return await titreFoncierActor.getVerificationHistoire(titreId);
  },

  estContestable: async (titreId) => {
    return await titreFoncierActor.estContestable(titreId);
  },

  mettreAJourGPS: async (titreId, nouvellesCoordonnees) => {
    return await titreFoncierActor.mettreAJourGPS(titreId, nouvellesCoordonnees);
  },
};

// Exemples d'utilisation
async function exemples() {
  try {
    // Créer un utilisateur
    const resultatCreation = await api.creerUtilisateur(
      "John Doe",
      "1990-01-01",
      "ID123456",
      "123 Rue Principale, Ville",
      "+1234567890",
      "john@example.com",
      "Proprietaire",
      null
    );
    console.log("Création utilisateur:", resultatCreation);

    // Vérifier l'utilisateur
    const utilisateur = await api.verifierUtilisateur();
    console.log("Utilisateur vérifié:", utilisateur);

    // Créer un titre
    const resultatTitre = await api.creerTitre(
      "456 Avenue Secondaire, Ville",
      1000, // superficie en m²
      48.8566, // latitude
      2.3522, // longitude
      [48.8566, 2.3522, 48.8570, 2.3530] // coordonnées GPS
    );
    console.log("Création titre:", resultatTitre);

    // Obtenir tous les titres
    const titres = await api.getAllTitres();
    console.log("Tous les titres:", titres);

    // Créer un litige
    if (titres.length > 0) {
      const resultatLitige = await api.creerLitige(
        titres[0].id,
        "Contestation de la limite de propriété"
      );
      console.log("Création litige:", resultatLitige);
    }

    // Obtenir les litiges
    const litiges = await api.getLitiges();
    console.log("Tous les litiges:", litiges);

  } catch (error) {
    console.error("Erreur lors de l'exécution des exemples:", error);
  }
}

// Exécuter les exemples
exemples();