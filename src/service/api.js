import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { idlFactory } from "../declarations/landx_backend";

const agent = new HttpAgent();
const titreFoncierActor = Actor.createActor(idlFactory, { 
  agent, 
  canisterId: process.env.CANISTER_ID_LANDX_BACKEND 
});

export const api = {
  creerUtilisateur: async (nom, dateNaissance, pieceIdentite, adresse, telephone, email, role, capaciteFinanciere, terrains) => {
    try {
      const capaciteFinanciereOpt = role === 'Acheteur' ? [capaciteFinanciere] : [];
      const terrainsOpt = role === 'Proprietaire' ? [terrains] : [];
      
      return await titreFoncierActor.creerUtilisateur(
        nom, 
        dateNaissance, 
        pieceIdentite, 
        adresse, 
        telephone, 
        email, 
        role,
        role === 'Acheteur' ? [capaciteFinanciere] : [null] 
      );
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
      throw error;
    }
  },

  mettreAJourUtilisateur: async (nom, dateNaissance, pieceIdentite, adresse, telephone, email, capaciteFinanciere) => {
    try {
      return await titreFoncierActor.mettreAJourUtilisateur(nom, dateNaissance, pieceIdentite, adresse, telephone, email, capaciteFinanciere);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
      throw error;
    }
  },

  verifierUtilisateur: async () => {
    try {
      return await titreFoncierActor.verifierUtilisateur();
    } catch (error) {
      console.error("Erreur lors de la vérification de l'utilisateur:", error);
      throw error;
    }
  },

  creerTitre: async (localisation, superficie, lat, long, gpsCoords) => {
    try {
      return await titreFoncierActor.creerTitre(localisation, Number(superficie), Number(lat), Number(long), gpsCoords.map(Number));
    } catch (error) {
      console.error("Erreur lors de la création du titre:", error);
      throw error;
    }
  },

  verifierTitre: async (titreId, proofType, proofHash) => {
    try {
      return await titreFoncierActor.verifierTitre(Number(titreId), proofType, proofHash);
    } catch (error) {
      console.error("Erreur lors de la vérification du titre:", error);
      throw error;
    }
  },

  contesterTitre: async (titreId, raison) => {
    try {
      return await titreFoncierActor.contesterTitre(Number(titreId), raison);
    } catch (error) {
      console.error("Erreur lors de la contestation du titre:", error);
      throw error;
    }
  },

  transfererTitre: async (id, nouveauProprietaire) => {
    try {
      return await titreFoncierActor.transfererTitre(Number(id), Principal.fromText(nouveauProprietaire));
    } catch (error) {
      console.error("Erreur lors du transfert du titre:", error);
      throw error;
    }
  },

  validerTransfert: async (transactionId) => {
    try {
      return await titreFoncierActor.validerTransfert(Number(transactionId));
    } catch (error) {
      console.error("Erreur lors de la validation du transfert:", error);
      throw error;
    }
  },

  ajouterDocument: async (titreId, nomDoc, hashDoc) => {
    try {
      return await titreFoncierActor.ajouterDocument(Number(titreId), nomDoc, hashDoc);
    } catch (error) {
      console.error("Erreur lors de l'ajout du document:", error);
      throw error;
    }
  },

  getTitre: async (id) => {
    try {
      return await titreFoncierActor.getTitre(Number(id));
    } catch (error) {
      console.error("Erreur lors de la récupération du titre:", error);
      throw error;
    }
  },

  getAllTitres: async () => {
    try {
      return await titreFoncierActor.getAllTitres();
    } catch (error) {
      console.error("Erreur lors de la récupération de tous les titres:", error);
      throw error;
    }
  },

  getTransactions: async (titreId) => {
    try {
      return await titreFoncierActor.getTransactions(Number(titreId));
    } catch (error) {
      console.error("Erreur lors de la récupération des transactions:", error);
      throw error;
    }
  },

  getLitiges: async () => {
    try {
      return await titreFoncierActor.getLitiges();
    } catch (error) {
      console.error("Erreur lors de la récupération des litiges:", error);
      throw error;
    }
  },

  getVerificationHistoire: async (titreId) => {
    try {
      return await titreFoncierActor.getVerificationHistoire(Number(titreId));
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique de vérification:", error);
      throw error;
    }
  },

  estContestable: async (titreId) => {
    try {
      return await titreFoncierActor.estContestable(Number(titreId));
    } catch (error) {
      console.error("Erreur lors de la vérification de la contestabilité:", error);
      throw error;
    }
  },

  mettreAJourGPS: async (titreId, nouvellesCoordonnees) => {
    try {
      return await titreFoncierActor.mettreAJourGPS(Number(titreId), nouvellesCoordonnees.map(Number));
    } catch (error) {
      console.error("Erreur lors de la mise à jour des coordonnées GPS:", error);
      throw error;
    }
  },
};