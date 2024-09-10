import React from 'react';
import { Link } from 'react-router-dom';

const Home= () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Bienvenue sur LandX</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Qu'est-ce que LandX ?</h2>
        <p className="text-lg mb-4">
          LandX est une plateforme innovante qui révolutionne la gestion et l'acquisition de terrains. 
          Notre solution combine la technologie blockchain avec les processus traditionnels de l'immobilier 
          pour offrir un service sécurisé, transparent et efficace.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Nos Services</h2>
        <ul className="list-disc list-inside text-lg">
          <li>Enregistrement sécurisé des titres fonciers</li>
          <li>Achat et vente de terrains en toute transparence</li>
          <li>Vérification instantanée des propriétés</li>
          <li>Gestion simplifiée des documents cadastraux</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Pourquoi Choisir LandX ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-yellow-100 p-4 rounded">
            <h3 className="text-xl font-semibold mb-2">Sécurité</h3>
            <p>Vos données sont protégées par la technologie blockchain.</p>
          </div>
          <div className="bg-green-100 p-4 rounded">
            <h3 className="text-xl font-semibold mb-2">Transparence</h3>
            <p>Accédez à l'historique complet de chaque propriété.</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded">
            <h3 className="text-xl font-semibold mb-2">Efficacité</h3>
            <p>Réduisez les délais et les coûts des transactions immobilières.</p>
          </div>
          <div className="bg-purple-100 p-4 rounded">
            <h3 className="text-xl font-semibold mb-2">Accessibilité</h3>
            <p>Gérez vos propriétés depuis n'importe où, à tout moment.</p>
          </div>
        </div>
      </section>

      <div className="text-center">
        <Link to="/login" className="bg-yellow-700 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
          Commencer Maintenant
        </Link>
      </div>
    </div>
  );
};

export default Home;