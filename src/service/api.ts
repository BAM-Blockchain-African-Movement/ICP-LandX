import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../declarations/"
// import { idlFactory } from "./declarations/titreFoncier.did.js";

const agent = new HttpAgent();
const titreFoncierActor = Actor.createActor(idlFactory, { agent, canisterId: process.env.TITRE_FONCIER_CANISTER_ID });

export const api = {
  creerUtilisateur: async (nom: string, role: string) => {
    return await titreFoncierActor.creerUtilisateur(nom, role);
  },

  creerTitre: async (localisation: string, superficie: number, lat: number, long: number, gpsCoords: number[]) => {
    return await titreFoncierActor.creerTitre(localisation, superficie, lat, long, gpsCoords);
  },

  verifierTitre: async (titreId: number, proofType: string, proofHash: string) => {
    return await titreFoncierActor.verifierTitre(titreId, proofType, proofHash);
  },

  contesterTitre: async (titreId: number, raison: string) => {
    return await titreFoncierActor.contesterTitre(titreId, raison);
  },

  transfererTitre: async (id: number, nouveauProprietaire: string) => {
    return await titreFoncierActor.transfererTitre(id, nouveauProprietaire);
  },

  validerTransfert: async (transactionId: number) => {
    return await titreFoncierActor.validerTransfert(transactionId);
  },

  ajouterDocument: async (titreId: number, nomDoc: string, hashDoc: string) => {
    return await titreFoncierActor.ajouterDocument(titreId, nomDoc, hashDoc);
  },

  creerLitige: async (titreId: number, description: string) => {
    return await titreFoncierActor.creerLitige(titreId, description);
  },

  resoudreLitige: async (litigeId: number, resolution: string) => {
    return await titreFoncierActor.resoudreLitige(litigeId, resolution);
  },

  getTitre: async (id: number) => {
    return await titreFoncierActor.getTitre(id);
  },

  getAllTitres: async () => {
    return await titreFoncierActor.getAllTitres();
  },

  getTransactions: async (titreId: number) => {
    return await titreFoncierActor.getTransactions(titreId);
  },

  verifierUtilisateur: async () => {
    return await titreFoncierActor.verifierUtilisateur();
  },

  getLitiges: async () => {
    return await titreFoncierActor.getLitiges();
  },

  getVerificationHistoire: async (titreId: number) => {
    return await titreFoncierActor.getVerificationHistoire(titreId);
  },

  estContestable: async (titreId: number) => {
    return await titreFoncierActor.estContestable(titreId);
  },

  mettreAJourGPS: async (titreId: number, nouvellesCoordonnees: number[]) => {
    return await titreFoncierActor.mettreAJourGPS(titreId, nouvellesCoordonnees);
  },
};