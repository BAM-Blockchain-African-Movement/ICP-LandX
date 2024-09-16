import HashMap "mo:base/HashMap";
import Nat32 "mo:base/Nat32";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Float "mo:base/Float";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Hash "mo:base/Hash";
import Int "mo:base/Int";
import Result "mo:base/Result";
import Buffer "mo:base/Buffer";

// Définition de l'acteur principal
actor AuthBackend {

  // Définition des types de données
  // Type User : représente un utilisateur du système
  type User = {
    name: Text;
    email: Text;
    address: Text;
    passwordHash: Text;
    role: Nat;
  };

 // Type Coordonnees : représente les coordonnées géographiques
  type Coordonnees = {
    latitude : Float;
    longitude : Float;
  };

// Type Document : représente un document lié à un titre foncier
  type Document = {
    id : Nat;
    nom : Text;
    hash : Text;
    dateUpload : Time.Time;
  };

// Type VerificationProof : représente une preuve de vérification pour un titre
  type VerificationProof = {
    verifierId: Principal;
    timestamp: Time.Time;
    proofType: Text;
    proofHash: Text;
  };

// Type Titre : représente un titre foncier
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
     hash : Text;
  };

// Type Transaction : représente une transaction immobilière
  type Transaction = {
    id : Nat;
    titreId : Nat;
    vendeur : Principal;
    acheteur : Principal;
    date : Time.Time;
    statut : Text;
  };

// Type Litige : représente un litige lié à un titre foncier
  type Litige = {
    id : Nat;
    titreId : Nat;
    demandeur : Principal;
    description : Text;
    dateCreation : Time.Time;
    statut : Text;
  };

// Stockage des données
  // HashMap pour stocker les utilisateurs
  private var users = HashMap.HashMap<Principal, User>(10, Principal.equal, Principal.hash);

  // Variables pour gérer les identifiants uniques
  private var nextTitreId : Nat = 1;
  private var nextTransactionId : Nat = 1;
  private var nextLitigeId : Nat = 1;
  private var nextDocumentId : Nat = 1;

// HashMaps pour stocker les titres, transactions, litiges et hashes de titres
   private let titres = HashMap.HashMap<Nat, Titre>(10, Nat.equal, Hash.hash);
  private let transactions = HashMap.HashMap<Nat, Transaction>(10, Nat.equal, Hash.hash);
  private let litiges = HashMap.HashMap<Nat, Litige>(10, Nat.equal, Hash.hash);
  private let titreHashMap = HashMap.HashMap<Text, Nat>(10, Text.equal, Text.hash);

 // Fonctions utilitaires

 // Fonction pour hacher un mot de passe
  private func hashPassword(password: Text) : Text {
    let hash = Text.hash(password);
    return Nat32.toText(hash);
  };

// Fonctions de gestion des utilisateurs

// Fonction pour enregistrer un nouvel utilisateur
  public shared(msg) func register(name: Text, email: Text, address: Text, password: Text) : async Bool {
    let caller = msg.caller;
    
    switch (users.get(caller)) {
      case (?_) { return false; };
      case null {
        let passwordHash = hashPassword(password);
        let newUser : User = {
          name = name;
          email = email;
          address = address;
          passwordHash = passwordHash;
          role = 0;
        };
        users.put(caller, newUser);
        return true;
      };
    };
  };

// Fonction pour connecter un utilisateur
  public shared(msg) func login(email: Text, password: Text) : async Bool {
    let caller = msg.caller;
    
    switch (users.get(caller)) {
      case (?user) {
        if (user.email == email and user.passwordHash == hashPassword(password)) {
          return true;
        } else {
          return false;
        };
      };
      case null { return false; };
    };
  };

// Fonction pour changer le mot de passe d'un utilisateur
  public shared(msg) func changePassword(oldPassword: Text, newPassword: Text) : async Bool {
    let caller = msg.caller;
    
    switch (users.get(caller)) {
      case (?user) {
        if (user.passwordHash == hashPassword(oldPassword)) {
          let updatedUser : User = {
            name = user.name;
            email = user.email;
            address = user.address;
            passwordHash = hashPassword(newPassword);
            role = user.role;
          };
          users.put(caller, updatedUser);
          return true;
        } else {
          return false;
        };
      };
      case null { return false; };
    };
  };

// Fonction pour obtenir les informations d'un utilisateur
  public shared(msg) func getUserInfo() : async ?User {
    let caller = msg.caller;
    users.get(caller)
  };

// Fonction pour définir le rôle d'un utilisateur
  public shared(msg) func setUserRole(userPrincipal: Principal, newRole: Nat) : async Bool {
    switch (users.get(userPrincipal)) {
      case (?user) {
        let updatedUser : User = {
          name = user.name;
          email = user.email;
          address = user.address;
          passwordHash = user.passwordHash;
          role = newRole;
        };
        users.put(userPrincipal, updatedUser);
        return true;
      };
      case null { return false; };
    };
  };

 // Fonctions de gestion des titres fonciers

 // Fonction pour créer un nouveau titre foncier
   public shared(msg) func createTitre(localisation: Text, superficie: Nat, coordonnees: Coordonnees, gpsCoordinates: [Float]) : async Nat {
    let id = nextTitreId;
    nextTitreId += 1;

    let titreHash = generateTitreHash(id, msg.caller, localisation, superficie);

    let nouveauTitre : Titre = {
      id = id;
      proprietaire = msg.caller;
      localisation = localisation;
      superficie = superficie;
      dateCreation = Time.now();
      coordonnees = coordonnees;
      documents = [];
      statut = "actif";
      verifications = [];
      gpsCoordinates = gpsCoordinates;
      contestationPeriodEnd = Time.now() + 30 * 24 * 60 * 60 * 1000000000; // 30 jours en nanosecondes
      hash = titreHash;
    };

    titres.put(id, nouveauTitre);
    titreHashMap.put(titreHash, id);
    id
  };

  // Type pour le résultat de la vérification
type VerificationResult = Result.Result<Text, Text>;
  
  // Fonction pour générer le hash d'un titre
  private func generateTitreHash(id: Nat, proprietaire: Principal, localisation: Text, superficie: Nat) : Text {
    let hashInput = Nat.toText(id) # Principal.toText(proprietaire) # localisation # Nat.toText(superficie);
    let hash = Text.hash(hashInput);
    Nat32.toText(hash)
  };

// Fonction pour vérifier un titre
     public shared(msg) func verifierTitre(titreId: Nat, proofType: Text, proofHash: Text) : async VerificationResult {
    switch (titres.get(titreId)) {
      case null { #err("Titre non trouvé") };
      case (?titre) {
        let nouvelleVerification : VerificationProof = {
          verifierId = msg.caller;
          timestamp = Time.now();
          proofType = proofType;
          proofHash = proofHash;
        };

        let verificationsMAJ = Array.append(titre.verifications, [nouvelleVerification]);
        let titreMAJ : Titre = {
          titre with
          verifications = verificationsMAJ;
        };

        titres.put(titreId, titreMAJ);
        #ok("Titre vérifié avec succès")
      };
    }
  };

  // Fonction pour rechercher un titre par son hash
  public query func searchTitreByHash(hash: Text) : async ?Titre {
    switch (titreHashMap.get(hash)) {
      case null { null };
      case (?titreId) { titres.get(titreId) };
    }
  };

  // Fonction pour obtenir tous les titres
  public query func getTitres() : async [Titre] {
    Iter.toArray(titres.vals())
  };

  // Fonction pour ajouter un document à un titre
   public shared(msg) func ajouterDocument(titreId: Nat, nom: Text, hash: Text) : async ?Nat {
    switch (titres.get(titreId)) {
      case null { null };
      case (?titre) {
        let documentId = nextDocumentId;
        nextDocumentId += 1;

        let nouveauDocument : Document = {
          id = documentId;
          nom = nom;
          hash = hash;
          dateUpload = Time.now();
          titreId = titreId; // Ajout de l'ID du titre
        };

        let documentsMAJ = Array.append(titre.documents, [nouveauDocument]);
        let titreMAJ : Titre = {
          titre with
          documents = documentsMAJ;
        };

        titres.put(titreId, titreMAJ);
        ?documentId
      };
    }
  };

  // Fonction pour lister tous les documents
  public query func listAllDocuments() : async [Document] {
    let buffer = Buffer.Buffer<Document>(0);
    for (titre in titres.vals()) {
      for (doc in titre.documents.vals()) {
        buffer.add(doc);
      };
    };
    Buffer.toArray(buffer)
  };


  // Fonction pour acheter un titre
  public shared(msg) func acheterTerrain(titreId: Nat) : async Bool {
    switch (titres.get(titreId)) {
      case null { false };
      case (?titre) {
        if (titre.proprietaire == msg.caller) {
          return false;
        };

        let transactionId = nextTransactionId;
        nextTransactionId += 1;

        let nouvelleTransaction : Transaction = {
          id = transactionId;
          titreId = titreId;
          vendeur = titre.proprietaire;
          acheteur = msg.caller;
          date = Time.now();
          statut = "en cours";
        };

        transactions.put(transactionId, nouvelleTransaction);

        let titreMisAJour : Titre = {
          titre with
          proprietaire = msg.caller;
          statut = "en transfert";
        };

        titres.put(titreId, titreMisAJour);
        true
      };
    }
  };

  // Fonction pour obtenir toutes les transactions
  public query func getTransactions() : async [Transaction] {
    Iter.toArray(transactions.vals())
  };


  // Fonction pour générer un titre foncier
  public func genererTitreFoncier(titreId: Nat) : async ?Text {
    switch (titres.get(titreId)) {
      case null { null };
      case (?titre) {
        let titreFoncier = "Titre Foncier #" # Nat.toText(titre.id) # "\n" #
                           "Propriétaire: " # Principal.toText(titre.proprietaire) # "\n" #
                           "Localisation: " # titre.localisation # "\n" #
                           "Superficie: " # Nat.toText(titre.superficie) # " m²\n" #
                           "Date de création: " # Int.toText(titre.dateCreation) # "\n" #
                           "Statut: " # titre.statut;
        ?titreFoncier
      };
    }
  };

  // Fonctions get supplémentaires

 // Fonction pour obtenir un titre spécifique
  public query func getTitre(titreId: Nat) : async ?Titre {
    titres.get(titreId)
  };

  // Fonction pour obtenir une transaction spécifique
  public query func getTransaction(transactionId: Nat) : async ?Transaction {
    transactions.get(transactionId)
  };

  // Fonction pour créer un litige
  public shared(msg) func creerLitige(titreId: Nat, description: Text) : async Nat {
    let id = nextLitigeId;
    nextLitigeId += 1;

    let nouveauLitige : Litige = {
      id = id;
      titreId = titreId;
      demandeur = msg.caller;
      description = description;
      dateCreation = Time.now();
      statut = "ouvert";
    };

    litiges.put(id, nouveauLitige);
    id
  };

  // Fonction pour obtenir tous les litiges
  public query func getLitiges() : async [Litige] {
    Iter.toArray(litiges.vals())
  };

  // Fonction pour obtenir un litige spécifique
  public query func getLitige(litigeId: Nat) : async ?Litige {
    litiges.get(litigeId)
  };


  // Fonction pour obtenir tous les documents d'un titre
  public query func getDocuments(titreId: Nat) : async ?[Document] {
    switch (titres.get(titreId)) {
      case null { null };
      case (?titre) { ?titre.documents };
    }
  };
}