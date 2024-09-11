import React from 'react';
import { motion } from 'framer-motion';

const Services = () => {
  const services = [
    {
      title: "Gestion des titres fonciers",
      description: "Enregistrez et gérez vos titres fonciers de manière sécurisée grâce à la technologie blockchain."
    },
    {
      title: "Vérification instantanée",
      description: "Vérifiez l'authenticité et l'historique des propriétés en temps réel."
    },
    {
      title: "Transactions transparentes",
      description: "Effectuez des transactions immobilières en toute transparence et sécurité."
    },
    {
      title: "Gestion des documents",
      description: "Stockez et gérez tous vos documents cadastraux de manière numérique et sécurisée."
    }
  ];

  return (
    <div className="bg-gradient-to-b from-amber-100 to-yellow-200 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-bold mb-12 text-center text-yellow-800"
        >
          Nos Services
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h2 className="text-2xl font-semibold mb-4 text-yellow-700">{service.title}</h2>
              <p className="text-yellow-900">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;