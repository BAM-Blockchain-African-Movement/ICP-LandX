import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="bg-gradient-to-b from-amber-100 to-yellow-200 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-bold mb-12 text-center text-yellow-800"
        >
          À Propos de LandX
        </motion.h1>

        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-12 bg-white p-8 rounded-lg shadow-md"
        >
          <h2 className="text-3xl font-semibold mb-4 text-yellow-700">Notre Mission</h2>
          <p className="text-lg mb-4 text-yellow-900">
            Chez LandX, notre mission est de révolutionner la gestion des titres fonciers en utilisant la puissance de la blockchain. 
            Nous visons à apporter transparence, sécurité et efficacité dans le secteur immobilier, en simplifiant les processus 
            et en réduisant les risques liés aux transactions foncières.
          </p>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-12 bg-white p-8 rounded-lg shadow-md"
        >
          <h2 className="text-3xl font-semibold mb-4 text-yellow-700">Notre Histoire</h2>
          <p className="text-lg mb-4 text-yellow-900">
            LandX a été fondée en 2024 par une équipe d'experts en technologie blockchain et en immobilier. 
            Conscients des défis liés à la gestion des titres fonciers, notamment en Afrique, nous avons décidé 
            de créer une solution innovante qui pourrait transformer le secteur.
          </p>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mb-12 bg-white p-8 rounded-lg shadow-md"
        >
          <h2 className="text-3xl font-semibold mb-4 text-yellow-700">Notre Vision</h2>
          <p className="text-lg mb-4 text-yellow-900">
            Nous envisageons un avenir où la gestion des titres fonciers est entièrement numérique, sécurisée et accessible à tous. 
            LandX aspire à devenir la référence mondiale en matière de gestion des titres fonciers basée sur la blockchain, 
            contribuant ainsi à un marché immobilier plus transparent et équitable.
          </p>
        </motion.section>
      </div>
    </div>
  );
};

export default About;