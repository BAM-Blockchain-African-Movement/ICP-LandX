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

actor AuthBackend {

  // Types existants
  type User = {
    name: Text;
    email: Text;
    address: Text;
    passwordHash: Text;
    role: Nat;
  };

  // Nouveaux types pour la gestion des terrains
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

  // Variables existantes
  private var users = HashMap.HashMap<Principal, User>(10, Principal.equal, Principal.hash);

  // Nouvelles variables pour la gestion des terrains
  private var nextTitreId : Nat = 1;
  private var nextTransactionId : Nat = 1;
  private var nextLitigeId : Nat = 1;
  private var nextDocumentId : Nat = 1;

 private let titres = HashMap.HashMap<Nat, Titre>(10, Nat.equal, Hash.hash);
  private let transactions = HashMap.HashMap<Nat, Transaction>(10, Nat.equal, Hash.hash);
  private let litiges = HashMap.HashMap<Nat, Litige>(10, Nat.equal, Hash.hash);

  // Fonctions existantes
  private func hashPassword(password: Text) : Text {
    let hash = Text.hash(password);
    return Nat32.toText(hash);
  };

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

  public shared(msg) func getUserInfo() : async ?User {
    let caller = msg.caller;
    users.get(caller)
  };

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

  // Nouvelles fonctions pour la gestion des terrains
  public shared(msg) func createTitre(localisation: Text, superficie: Nat, coordonnees: Coordonnees, gpsCoordinates: [Float]) : async Nat {
    let id = nextTitreId;
    nextTitreId += 1;

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
    };

    titres.put(id, nouveauTitre);
    id
  };

  public query func getTitres() : async [Titre] {
    Iter.toArray(titres.vals())
  };

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

  public query func getTransactions() : async [Transaction] {
    Iter.toArray(transactions.vals())
  };

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
  public query func getTitre(titreId: Nat) : async ?Titre {
    titres.get(titreId)
  };

  public query func getTransaction(transactionId: Nat) : async ?Transaction {
    transactions.get(transactionId)
  };

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

  public query func getLitiges() : async [Litige] {
    Iter.toArray(litiges.vals())
  };

  public query func getLitige(litigeId: Nat) : async ?Litige {
    litiges.get(litigeId)
  };

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

  public query func getDocuments(titreId: Nat) : async ?[Document] {
    switch (titres.get(titreId)) {
      case null { null };
      case (?titre) { ?titre.documents };
    }
  };
}