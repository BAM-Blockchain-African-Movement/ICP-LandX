import React, { useState } from 'react';
import { landx_backend as AuthBackend } from 'declarations/landx_backend';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const AuthPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        password: '',
        role: 0
    });
    
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: name === 'role' ? parseInt(value, 10) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        
        try {
            if (isLogin) {
                const success = await login(formData.email, formData.password);
                if (success) {
                    setMessage('Connexion réussie !');
                    navigate('/home');
                } else {
                    setMessage('Échec de la connexion. Vérifiez vos identifiants.');
                }
            } else {
                const success = await AuthBackend.register(formData.name, formData.email, formData.address, formData.password, formData.role);
                if (success) {
                    setMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
                    setIsLogin(true);
                } else {
                    setMessage('Échec de l\'inscription. L\'utilisateur existe peut-être déjà.');
                }
            }
        } catch (error) {
            console.error('Erreur lors de l\'authentification:', error);
            setMessage('Une erreur est survenue. Veuillez réessayer plus tard.');
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setFormData({
            name: '',
            email: '',
            address: '',
            password: '',
            role: 0
        });
        setMessage('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-100 to-yellow-200 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-3xl font-bold mb-6 text-center text-yellow-800">
                    {isLogin ? 'Connexion' : 'Inscription'}
                </h2>
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-yellow-700 text-sm font-bold mb-2">Nom</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="address" className="block text-yellow-700 text-sm font-bold mb-2">Adresse</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500"
                                    required
                                />
                            </div>
                        </>
                    )}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-yellow-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500"
                            required
                        />
                    </div>
                    {!isLogin && (
                        <div className="mb-4">
                            <label htmlFor="role" className="block text-yellow-700 text-sm font-bold mb-2">Rôle</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500"
                            >
                                <option value={0}>Utilisateur standard</option>
                                <option value={1}>Administrateur</option>
                            </select>
                        </div>
                    )}
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-yellow-700 text-sm font-bold mb-2">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500"
                            required
                        />
                    </div>
                    {message && (
                        <div className={`mb-4 p-2 rounded ${message.includes('réussie') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition duration-300"
                    >
                        {isLogin ? 'Se connecter' : 'S\'inscrire'}
                    </button>
                </form>
                <p className="mt-4 text-center text-yellow-800">
                    {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
                    <button
                        onClick={toggleForm}
                        className="text-yellow-600 hover:underline ml-1"
                    >
                        {isLogin ? "S'inscrire" : "Se connecter"}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;