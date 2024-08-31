import Time "mo:base/Time";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Option "mo:base/Option";
import List "mo:base/List";
import Iter "mo:base/Iter";
import Error "mo:base/Error";
import Result "mo:base/Result";

actor TitreFoncier {
    type UserRole = {
        #Fonctionnaire;
        #Proprietaire;
        #AgentImmobilier;
        #Public;
    };

    type User = {
        id : Principal;
        role : UserRole;
        nom : Text;
    };

    type Coordonnees = {
        latitude : Float;
        longitude : Float;
    };

    type Document = {
        id : Nat;
        nom : Text;
        hash : Text;
        dateUpload : Time.Time;
    };

    type Titre = {
        id : Nat;
        proprietaire : Principal;
        localisation : Text;
        superficie : Nat;
        dateCreation : Time.Time;
        coordonnees : Coordonnees;
        documents : [Document];
        statut : Text;
    };

    type Transaction = {
        id : Nat;
        titreId : Nat;
        vendeur : Principal;
        acheteur : Principal;
        date : Time.Time;
        statut : Text;
    };

    type Litige = {
        id : Nat;
        titreId : Nat;
        demandeur : Principal;
        description : Text;
        dateCreation : Time.Time;
        statut : Text;
    };

    private stable var nextId : Nat = 0;
    private stable var nextDocId : Nat = 0;
    private stable var nextTransactionId : Nat = 0;
    private stable var nextLitigeId : Nat = 0;
    private var titres = HashMap.HashMap<Nat, Titre>(0, Nat.equal, Nat.hash);
    private var users = HashMap.HashMap<Principal, User>(0, Principal.equal, Principal.hash);
    private var transactions = HashMap.HashMap<Nat, Transaction>(0, Nat.equal, Nat.hash);
    private var litiges = HashMap.HashMap<Nat, Litige>(0, Nat.equal, Nat.hash);

    // Fonction pour créer un utilisateur
    public shared(msg) func creerUtilisateur(nom : Text, role : UserRole) : async Bool {
        let user : User = {
            id = msg.caller;
            nom = nom;
            role = role;
        };
        users.put(msg.caller, user);
        true
    };

    // Fonction pour créer un titre foncier (accessible aux fonctionnaires)
    public shared(msg) func creerTitre(localisation : Text, superficie : Nat, lat : Float, long : Float) : async Result<Nat, Text> {
        switch (users.get(msg.caller)) {
            case (?user) {
                switch (user.role) {
                    case (#Fonctionnaire) {
                        let id = nextId;
                        nextId += 1;

                        let nouveauTitre : Titre = {
                            id = id;
                            proprietaire = msg.caller;
                            localisation = localisation;
                            superficie = superficie;
                            dateCreation = Time.now();
                            coordonnees = { latitude = lat; longitude = long };
                            documents = [];
                            statut = "Actif";
                        };

                        titres.put(id, nouveauTitre);
                        #ok(id)
                    };
                    case (_) #err("Accès non autorisé. Seuls les fonctionnaires peuvent créer des titres.")
                };
            };
            case (null) #err("Utilisateur non trouvé.")
        }
    };

    // Fonction pour transférer un titre (accessible aux propriétaires et agents immobiliers)
    public shared(msg) func transfererTitre(id : Nat, nouveauProprietaire : Principal) : async Result<Bool, Text> {
        switch (users.get(msg.caller)) {
            case (?user) {
                switch (user.role) {
                    case (#Proprietaire or #AgentImmobilier) {
                        switch (titres.get(id)) {
                            case (?titre) {
                                if (titre.proprietaire == msg.caller) {
                                    let titreModifie = {
                                        id = titre.id;
                                        proprietaire = nouveauProprietaire;
                                        localisation = titre.localisation;
                                        superficie = titre.superficie;
                                        dateCreation = titre.dateCreation;
                                        coordonnees = titre.coordonnees;
                                        documents = titre.documents;
                                        statut = "En attente de validation";
                                    };
                                    titres.put(id, titreModifie);
                                    
                                    let transactionId = nextTransactionId;
                                    nextTransactionId += 1;
                                    let transaction : Transaction = {
                                        id = transactionId;
                                        titreId = id;
                                        vendeur = msg.caller;
                                        acheteur = nouveauProprietaire;
                                        date = Time.now();
                                        statut = "En attente";
                                    };
                                    transactions.put(transactionId, transaction);
                                    
                                    #ok(true)
                                } else {
                                    #err("Vous n'êtes pas le propriétaire de ce titre.")
                                }
                            };
                            case (null) #err("Titre non trouvé.")
                        }
                    };
                    case (_) #err("Accès non autorisé. Seuls les propriétaires et les agents immobiliers peuvent transférer des titres.")
                };
            };
            case (null) #err("Utilisateur non trouvé.")
        }
    };

    // Fonction pour valider un transfert (accessible aux fonctionnaires)
    public shared(msg) func validerTransfert(transactionId : Nat) : async Result<Bool, Text> {
        switch (users.get(msg.caller)) {
            case (?user) {
                switch (user.role) {
                    case (#Fonctionnaire) {
                        switch (transactions.get(transactionId)) {
                            case (?transaction) {
                                if (transaction.statut == "En attente") {
                                    let titreModifie = switch (titres.get(transaction.titreId)) {
                                        case (?titre) {
                                            {
                                                id = titre.id;
                                                proprietaire = transaction.acheteur;
                                                localisation = titre.localisation;
                                                superficie = titre.superficie;
                                                dateCreation = titre.dateCreation;
                                                coordonnees = titre.coordonnees;
                                                documents = titre.documents;
                                                statut = "Actif";
                                            }
                                        };
                                        case (null) return #err("Titre non trouvé.");
                                    };
                                    titres.put(transaction.titreId, titreModifie);
                                    
                                    let transactionModifiee = {
                                        id = transaction.id;
                                        titreId = transaction.titreId;
                                        vendeur = transaction.vendeur;
                                        acheteur = transaction.acheteur;
                                        date = transaction.date;
                                        statut = "Validé";
                                    };
                                    transactions.put(transactionId, transactionModifiee);
                                    
                                    #ok(true)
                                } else {
                                    #err("Cette transaction a déjà été traitée.")
                                }
                            };
                            case (null) #err("Transaction non trouvée.")
                        }
                    };
                    case (_) #err("Accès non autorisé. Seuls les fonctionnaires peuvent valider les transferts.")
                };
            };
            case (null) #err("Utilisateur non trouvé.")
        }
    };

    // Fonction pour ajouter un document à un titre
    public shared(msg) func ajouterDocument(titreId : Nat, nomDoc : Text, hashDoc : Text) : async Result<Bool, Text> {
        switch (users.get(msg.caller)) {
            case (?user) {
                switch (user.role) {
                    case (#Proprietaire or #Fonctionnaire) {
                        switch (titres.get(titreId)) {
                            case (?titre) {
                                if (titre.proprietaire == msg.caller or user.role == #Fonctionnaire) {
                                    let docId = nextDocId;
                                    nextDocId += 1;
                                    let nouveauDoc : Document = {
                                        id = docId;
                                        nom = nomDoc;
                                        hash = hashDoc;
                                        dateUpload = Time.now();
                                    };
                                    let nouveauxDocs = Array.append(titre.documents, [nouveauDoc]);
                                    let titreModifie = {
                                        id = titre.id;
                                        proprietaire = titre.proprietaire;
                                        localisation = titre.localisation;
                                        superficie = titre.superficie;
                                        dateCreation = titre.dateCreation;
                                        coordonnees = titre.coordonnees;
                                        documents = nouveauxDocs;
                                        statut = titre.statut;
                                    };
                                    titres.put(titreId, titreModifie);
                                    #ok(true)
                                } else {
                                    #err("Vous n'avez pas les droits pour ajouter un document à ce titre.")
                                }
                            };
                            case (null) #err("Titre non trouvé.")
                        }
                    };
                    case (_) #err("Accès non autorisé. Seuls les propriétaires et les fonctionnaires peuvent ajouter des documents.")
                };
            };
            case (null) #err("Utilisateur non trouvé.")
        }
    };

    // Fonction pour créer un litige
    public shared(msg) func creerLitige(titreId : Nat, description : Text) : async Result<Nat, Text> {
        switch (users.get(msg.caller)) {
            case (?user) {
                let id = nextLitigeId;
                nextLitigeId += 1;
                let nouveauLitige : Litige = {
                    id = id;
                    titreId = titreId;
                    demandeur = msg.caller;
                    description = description;
                    dateCreation = Time.now();
                    statut = "En attente";
                };
                litiges.put(id, nouveauLitige);
                #ok(id)
            };
            case (null) #err("Utilisateur non trouvé.")
        }
    };

    // Fonction pour résoudre un litige (accessible aux fonctionnaires)
    public shared(msg) func resoudreLitige(litigeId : Nat, resolution : Text) : async Result<Bool, Text> {
        switch (users.get(msg.caller)) {
            case (?user) {
                switch (user.role) {
                    case (#Fonctionnaire) {
                        switch (litiges.get(litigeId)) {
                            case (?litige) {
                                let litigeResolu = {
                                    id = litige.id;
                                    titreId = litige.titreId;
                                    demandeur = litige.demandeur;
                                    description = litige.description;
                                    dateCreation = litige.dateCreation;
                                    statut = "Résolu: " # resolution;
                                };
                                litiges.put(litigeId, litigeResolu);
                                #ok(true)
                            };
                            case (null) #err("Litige non trouvé.")
                        }
                    };
                    case (_) #err("Accès non autorisé. Seuls les fonctionnaires peuvent résoudre les litiges.")
                };
            };
            case (null) #err("Utilisateur non trouvé.")
        }
    };

    // Fonction pour obtenir les détails d'un titre
    public query func getTitre(id : Nat) : async ?Titre {
        titres.get(id)
    };

    // Fonction pour obtenir tous les titres (avec filtrage pour les non-fonctionnaires)
    public query(msg) func getAllTitres() : async [Titre] {
        switch (users.get(msg.caller)) {
            case (?user) {
                switch (user.role) {
                    case (#Fonctionnaire) Iter.toArray(titres.vals());
                    case (#AgentImmobilier) Iter.toArray(titres.vals());
                    case (_) Iter.toArray(titres.vals()); // Pour les propriétaires et le public, on pourrait filtrer les informations sensibles ici
                };
            };
            case (null) []; // Retourne une liste vide si l'utilisateur n'est pas trouvé
        }
    };

    // Fonction pour obtenir les transactions d'un titre
    public query func getTransactions(titreId : Nat) : async [Transaction] {
        Iter.toArray(transactions.vals())
    };

    // Fonction pour vérifier l'utilisateur actuel
    public shared query(msg) func verifierUtilisateur() : async ?User {
        users.get(msg.caller)
    };

    // Fonction pour obtenir les litiges (accessible aux fonctionnaires)
    public shared query(msg) func getLitiges() : async Result<[Litige], Text> {
        switch (users.get(msg.caller)) {
            case (?user) {
                switch (user.role) {
                    case (#Fonctionnaire) #ok(Iter.toArray(litiges.vals()));
                    case (_) #err("Accès non autorisé. Seuls les fonctionnaires peuvent voir tous les litiges.");
                };
            };
            case (null) #err("Utilisateur non trouvé.");
        }
    };
}