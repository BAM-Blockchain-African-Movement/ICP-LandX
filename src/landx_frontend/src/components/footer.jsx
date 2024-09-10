import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">LandX</h3>
            <p className="text-sm">Révolutionner la gestion immobilière grâce à la blockchain.</p>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Liens Rapides</h3>
            <ul className="text-sm">
              <li><Link to="/" className="hover:text-yellow-700">Accueil</Link></li>
              <li><Link to="/about" className="hover:text-yellow-700">À Propos</Link></li>
              <li><Link to="/services" className="hover:text-yellow-700">Services</Link></li>
              <li><Link to="/contact" className="hover:text-yellow-700">Contact</Link></li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Nous Contacter</h3>
            <p className="text-sm">Email: contact@landx.com</p>
            <p className="text-sm">Téléphone: +123 456 7890</p>
          </div>
          <div className="w-full md:w-1/4">
            <h3 className="text-lg font-semibold mb-2">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-yellow-700">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-white hover:text-yellow-700">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white hover:text-yellow-700">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          <p>&copy; 2024 LandX. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;