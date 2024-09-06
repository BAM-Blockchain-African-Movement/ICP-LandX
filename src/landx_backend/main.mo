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
import Hash "mo:base/Hash";

actor TitreFoncier {
    type UserCommon = {
        id : Principal;
        nom : Text;
        dateNaissance : Text;
        pieceIdentite : Text;
        adresse : Text;
        telephone : Text;
        email : Text;
    };

    type Proprietaire = UserCommon and {
        terrains : [Nat];  // IDs des terrains possédés
    };

    type Acheteur = UserCommon and {
        capaciteFinanciere : Text;  // Référence aux preuves de financement
    };

    type Fonctionnaire = UserCommon and {
        departement : Text;
        niveau : Text;
    };

    type UserRole = {
        #Proprietaire : Proprietaire;
        #Acheteur : Acheteur;
        #Fonctionnaire : Fonctionnaire;
    };

    type User = {
        role : UserRole;
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

    type VerificationProof = {
        verifierId: Principal;
        timestamp: Time.Time;
        proofType: Text;
        proofHash: Text;
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
        verifications : [VerificationProof];
        gpsCoordinates : [Float];
        contestationPeriodEnd : Time.Time;
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

    func natHash(n : Nat) : Hash.Hash {
        Text.hash(Nat.toText(n))
    };

    private stable var nextId : Nat = 0;
    private stable var nextDocId : Nat = 0;
    private stable var nextTransactionId : Nat = 0;
    private stable var nextLitigeId : Nat = 0;
    private var titres = HashMap.HashMap<Nat, Titre>(0, Nat.equal, natHash);
    private var users = HashMap.HashMap<Principal, User>(0, Principal.equal, Principal.hash);
    private var transactions = HashMap.HashMap<Nat, Transaction>(0, Nat.equal, natHash);
    private var litiges = HashMap.HashMap<Nat, Litige>(0, Nat.equal, natHash);

    public shared(msg) func creerUtilisateur(
        nom : Text, 
        dateNaissance : Text, 
        pieceIdentite : Text, 
        adresse : Text, 
        telephone : Text, 
        email : Text, 
        role : Text,
        capaciteFinanciere : ?Text
    ) : async Result.Result<Bool, Text> {
        let userCommon : UserCommon = {
            id = msg.caller;
            nom = nom;
            dateNaissance = dateNaissance;
            pieceIdentite = pieceIdentite;
            adresse = adresse;
            telephone = telephone;
            email = email;
        };

        let userRole = switch (role) {
            case "Proprietaire" {
                #Proprietaire({userCommon with terrains = []})
            };
            case "Acheteur" {
                switch (capaciteFinanciere) {
                    case (?cap) {
                        #Acheteur({userCommon with capaciteFinanciere = cap})
                    };
                    case (null) {
                        return #err("Capacité financière requise pour un acheteur")
                    };
                }
            };
            case "Fonctionnaire" {
                #Fonctionnaire({userCommon with departement = ""; niveau = ""})
            };
            case _ {
                return #err("Rôle non reconnu")
            };
        };

        let user : User = {
            role = userRole;
        };

        users.put(msg.caller, user);
        #ok(true)
    };

    public shared(msg) func mettreAJourUtilisateur(
        nom : ?Text, 
        dateNaissance : ?Text, 
        pieceIdentite : ?Text, 
        adresse : ?Text, 
        telephone : ?Text, 
        email : ?Text, 
        capaciteFinanciere : ?Text
    ) : async Result.Result<Bool, Text> {
        switch (users.get(msg.caller)) {
            case (?user) {
                let updatedUser = switch (user.role) {
                    case (#Proprietaire(p)) {
                        #Proprietaire({
                            id = p.id;
                            nom = Option.get(nom, p.nom);
                            dateNaissance = Option.get(dateNaissance, p.dateNaissance);
                            pieceIdentite = Option.get(pieceIdentite, p.pieceIdentite);
                            adresse = Option.get(adresse, p.adresse);
                            telephone = Option.get(telephone, p.telephone);
                            email = Option.get(email, p.email);
                            terrains = p.terrains;
                        })
                    };
                    case (#Acheteur(a)) {
                        #Acheteur({
                            id = a.id;
                            nom = Option.get(nom, a.nom);
                            dateNaissance = Option.get(dateNaissance, a.dateNaissance);
                            pieceIdentite = Option.get(pieceIdentite, a.pieceIdentite);
                            adresse = Option.get(adresse, a.adresse);
                            telephone = Option.get(telephone, a.telephone);
                            email = Option.get(email, a.email);
                            capaciteFinanciere = Option.get(capaciteFinanciere, a.capaciteFinanciere);
                        })
                    };
                    case (#Fonctionnaire(f)) {
                        #Fonctionnaire({
                            id = f.id;
                            nom = Option.get(nom, f.nom);
                            dateNaissance = Option.get(dateNaissance, f.dateNaissance);
                            pieceIdentite = Option.get(pieceIdentite, f.pieceIdentite);
                            adresse = Option.get(adresse, f.adresse);
                            telephone = Option.get(telephone, f.telephone);
                            email = Option.get(email, f.email);
                            departement = f.departement;
                            niveau = f.niveau;
                        })
                    };
                };
                users.put(msg.caller, { role = updatedUser });
                #ok(true)
            };
            case (null) #err("Utilisateur non trouvé.")
        }
    };

    public shared(msg) func creerTitre(localisation : Text, superficie : Nat, lat : Float, long : Float, gpsCoords : [Float]) : async Result.Result<Nat, Text> {
        switch (users.get(msg.caller)) {
            case (?user) {
                switch (user.role) {
                    case (#Fonctionnaire(_)) {
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
                            statut = "En attente de vérification";
                            verifications = [];
                            gpsCoordinates = gpsCoords;
                            contestationPeriodEnd = Time.now() + 30 * 24 * 60 * 60 * 1000000000;
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

    public shared(msg) func verifierTitre(titreId : Nat, proofType : Text, proofHash : Text) : async Result.Result<Bool, Text> {
        switch (users.get(msg.caller)) {
            case (?user) {
                switch (user.role) {
                    case (#Fonctionnaire(_)) {
                        switch (titres.get(titreId)) {
                            case (?titre) {
                                let nouvelleVerification : VerificationProof = {
                                    verifierId = msg.caller;
                                    timestamp = Time.now();
                                    proofType = proofType;
                                    proofHash = proofHash;
                                };
                                let nouvellesVerifications = Array.append(titre.verifications, [nouvelleVerification]);
                                let titreModifie = {
                                    id = titre.id;
                                    proprietaire = titre.proprietaire;
                                    localisation = titre.localisation;
                                    superficie = titre.superficie;
                                    dateCreation = titre.dateCreation;
                                    coordonnees = titre.coordonnees;
                                    documents = titre.documents;
                                    statut = if (nouvellesVerifications.size() >= 3) "Vérifié" else titre.statut;
                                    verifications = nouvellesVerifications;
                                    gpsCoordinates = titre.gpsCoordinates;
                                    contestationPeriodEnd = titre.contestationPeriodEnd;
                                };
                                titres.put(titreId, titreModifie);
                                #ok(true)
                            };
                            case (null) #err("Titre non trouvé.")
                        }
                    };
                    case (_) #err("Accès non autorisé. Seuls les fonctionnaires peuvent vérifier les titres.")
                };
            };
            case (null) #err("Utilisateur non trouvé.")
        }
    };

    public shared(msg) func contesterTitre(titreId : Nat, raison : Text) : async Result.Result<Bool, Text> {
        switch (users.get(msg.caller)) {
            case (?user) {
                switch (titres.get(titreId)) {
                    case (?titre) {
                        if (Time.now() <= titre.contestationPeriodEnd) {
                            let id = nextLitigeId;
                            nextLitigeId += 1;
                            let nouveauLitige : Litige = {
                                id = id;
                                titreId = titreId;
                                demandeur = msg.caller;
                                description = raison;
                                dateCreation = Time.now();
                                statut = "En attente";
                            };
                            litiges.put(id, nouveauLitige);
                            #ok(true)
                        } else {
                            #err("La période de contestation est terminée pour ce titre.")
                        }
                    };
                    case (null) #err("Titre non trouvé.")
                }
            };
            case (null) #err("Utilisateur non trouvé.")
        }
    };

    public shared(msg) func transfererTitre(id : Nat, nouveauProprietaire : Principal) : async Result.Result<Bool, Text> {
        switch (users.get(msg.caller)) {
            case (?user) {
                switch (user.role) {
                    case (#Proprietaire(p)) {
                        switch (titres.get(id)) {
                            case (?titre) {
                                if (titre.proprietaire == msg.caller and titre.statut == "Vérifié") {
                                    let titreModifie = {
                                        id = titre.id;
                                        proprietaire = nouveauProprietaire;
                                        localisation = titre.localisation;
                                        superficie = titre.superficie;
                                        dateCreation = titre.dateCreation;
                                        coordonnees = titre.coordonnees;
                                        documents = titre.documents;
                                        statut = "En attente de validation";
                                        verifications = titre.verifications;
                                        gpsCoordinates = titre.gpsCoordinates;
                                        contestationPeriodEnd = titre.contestationPeriodEnd;
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
                                    #err("Vous n'êtes pas le propriétaire de ce titre ou le titre n'est pas vérifié.")
                                }
                            };
                            case (null) #err("Titre non trouvé.")
                        }
                    };
                    case (_) #err("Accès non autorisé. Seuls les propriétaires peuvent transférer des titres.")
                };
            };
            case (null) #err("Utilisateur non trouvé.")
        }
    };

    public shared(msg) func validerTransfert(transactionId : Nat) : async Result.Result<Bool, Text> {
        switch (users.get(msg.caller)) {
            case (?user) {
                switch (user.role) {
                    case (#Fonctionnaire(_)) {
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
                                                statut = "Vérifié";
                                                verifications = titre.verifications;
                                                gpsCoordinates = titre.gpsCoordinates;
                                                contestationPeriodEnd = Time.now() + 30 * 24 * 60 * 60 * 1000000000;
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

   public shared(msg) func ajouterDocument(titreId : Nat, nomDoc : Text, hashDoc : Text) : async Result.Result<Bool, Text> {
    switch (users.get(msg.caller)) {
        case (?user) {
            switch (user.role) {
                case (#Proprietaire(p)) {
                    switch (titres.get(titreId)) {
                        case (?titre) {
                            if (titre.proprietaire == msg.caller) {
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
                                    verifications = titre.verifications;
                                    gpsCoordinates = titre.gpsCoordinates;
                                    contestationPeriodEnd = titre.contestationPeriodEnd;
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
                case (#Fonctionnaire(_)) {
                    switch (titres.get(titreId)) {
                        case (?titre) {
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
                                verifications = titre.verifications;
                                gpsCoordinates = titre.gpsCoordinates;
                                contestationPeriodEnd = titre.contestationPeriodEnd;
                            };
                            titres.put(titreId, titreModifie);
                            #ok(true)
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

    public shared(msg) func creerLitige(titreId : Nat, description : Text) : async Result.Result<Nat, Text> {
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

    public shared(msg) func resoudreLitige(litigeId : Nat, resolution : Text) : async Result.Result<Bool, Text> {
        switch (users.get(msg.caller)) {
            case (?user) {
                switch (user.role) {
                    case (#Fonctionnaire(_)) {
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

    public query func getTitre(id : Nat) : async ?Titre {
        titres.get(id)
    };

    public query(msg) func getAllTitres() : async [Titre] {
        switch (users.get(msg.caller)) {
            case (?user) {
                switch (user.role) {
                    case (#Fonctionnaire(_)) Iter.toArray(titres.vals());
                    case (#Proprietaire(_)) {
                        // Filtrer pour ne montrer que les titres du propriétaire
                        Iter.toArray(Iter.filter(titres.vals(), func (t: Titre) : Bool { t.proprietaire == msg.caller }))
                    };
                    case (#Acheteur(_)) Iter.toArray(titres.vals());  // Les acheteurs peuvent voir tous les titres
                };
            };
            case (null) []; // Retourne une liste vide si l'utilisateur n'est pas trouvé
        }
    };

    public query func getTransactions(titreId : Nat) : async [Transaction] {
        Iter.toArray(Iter.filter(transactions.vals(), func (t: Transaction) : Bool { t.titreId == titreId }))
    };

    public shared query(msg) func verifierUtilisateur() : async ?User {
        users.get(msg.caller)
    };

    public shared query(msg) func getLitiges() : async Result.Result<[Litige], Text> {
        switch (users.get(msg.caller)) {
            case (?user) {
                switch (user.role) {
                    case (#Fonctionnaire(_)) #ok(Iter.toArray(litiges.vals()));
                    case (_) #err("Accès non autorisé. Seuls les fonctionnaires peuvent voir tous les litiges.");
                };
            };
            case (null) #err("Utilisateur non trouvé.");
        }
    };

    public query func getVerificationHistoire(titreId : Nat) : async Result.Result<[VerificationProof], Text> {
        switch (titres.get(titreId)) {
            case (?titre) #ok(titre.verifications);
            case (null) #err("Titre non trouvé.");
        }
    };

    public query func estContestable(titreId : Nat) : async Result.Result<Bool, Text> {
        switch (titres.get(titreId)) {
            case (?titre) #ok(Time.now() <= titre.contestationPeriodEnd);
            case (null) #err("Titre non trouvé.");
        }
    };

    public shared(msg) func mettreAJourGPS(titreId : Nat, nouvellesCoordonnees : [Float]) : async Result.Result<Bool, Text> {
        switch (users.get(msg.caller)) {
            case (?user) {
                switch (user.role) {
                    case (#Fonctionnaire(_)) {
                        switch (titres.get(titreId)) {
                            case (?titre) {
                                let titreModifie = {
                                    id = titre.id;
                                    proprietaire = titre.proprietaire;
                                    localisation = titre.localisation;
                                    superficie = titre.superficie;
                                    dateCreation = titre.dateCreation;
                                    coordonnees = titre.coordonnees;
                                    documents = titre.documents;
                                    statut = titre.statut;
                                    verifications = titre.verifications;
                                    gpsCoordinates = nouvellesCoordonnees;
                                    contestationPeriodEnd = titre.contestationPeriodEnd;
                                };
                                titres.put(titreId, titreModifie);
                                #ok(true)
                            };
                            case (null) #err("Titre non trouvé.")
                        }
                    };
                    case (_) #err("Accès non autorisé. Seuls les fonctionnaires peuvent mettre à jour les coordonnées GPS.")
                };
            };
            case (null) #err("Utilisateur non trouvé.")
        }
    };
};