import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    });

    const hiddenElements = document.querySelectorAll('.fade-in');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="bg-gradient-to-b from-amber-100 to-yellow-200 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-bold mb-6 text-center text-yellow-800"
        >
          Bienvenue sur LandX
        </motion.h1>
        
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-12 fade-in"
        >
          <h2 className="text-3xl font-semibold mb-4 text-yellow-700">Qu'est-ce que LandX ?</h2>
          <p className="text-lg mb-4 text-yellow-900">
            LandX est une plateforme innovante qui révolutionne la gestion et l'acquisition de terrains. 
            Notre solution combine la technologie blockchain avec les processus traditionnels de l'immobilier 
            pour offrir un service sécurisé, transparent et efficace.
          </p>
        </motion.section>
  
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-12 fade-in"
        >
          <h2 className="text-3xl font-semibold mb-4 text-yellow-700">Nos Services</h2>
          <ul className="list-none text-lg space-y-2">
            {[
              "Enregistrement sécurisé des titres fonciers",
              "Achat et vente de terrains en toute transparence",
              "Vérification instantanée des propriétés",
              "Gestion simplifiée des documents cadastraux"
            ].map((service, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.2 }}
                className="flex items-center text-yellow-900"
              >
                <span className="mr-2 text-yellow-600">•</span> {service}
              </motion.li>
            ))}
          </ul>
        </motion.section>
  
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mb-12 fade-in"
        >
          <h2 className="text-3xl font-semibold mb-4 text-yellow-700">Pourquoi Choisir LandX ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Sécurité", desc: "Vos données sont protégées par la technologie blockchain.", color: "bg-yellow-50" },
              { title: "Transparence", desc: "Accédez à l'historique complet de chaque propriété.", color: "bg-green-50" },
              { title: "Efficacité", desc: "Réduisez les délais et les coûts des transactions immobilières.", color: "bg-yellow-50" },
              { title: "Accessibilité", desc: "Gérez vos propriétés depuis n'importe où, à tout moment.", color: "bg-yellow-100" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.05 }}
                className={`${item.color} p-6 rounded-lg shadow-md transition-all duration-300`}
              >
                <h3 className="text-2xl font-semibold mb-2 text-yellow-800">{item.title}</h3>
                <p className="text-yellow-900">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
  
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="text-center fade-in"
        >
          <Link to="/terrain-management" className="bg-yellow-700 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105">
            Commencer Maintenant
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default Home;