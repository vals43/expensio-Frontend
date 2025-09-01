import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MailIcon, LockIcon } from 'lucide-react';
import { AuthLayout } from '../components/layout/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { SocialLogin } from '../components/SocialLogin';
import { useTheme } from '../components/theme/ThemeProvider';
import axios from 'axios'; // ⬅️ Import de la librairie axios pour les requêtes HTTP

// Assurez-vous d'avoir un fichier de configuration pour votre URL d'API
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
const API_URL = BACKEND_URL; 

export function Login() {
  const { theme } = useTheme();
  const navigate = useNavigate(); // ⬅️ Utilisation de useNavigate pour la redirection
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(''); // ⬅️ Ajout d'un état pour les erreurs de connexion de l'API

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    // Efface l'erreur de l'API quand l'utilisateur tape
    if (loginError) {
      setLoginError('');
    }
  };

  const handleSubmit = async e => { // ⬅️ Fonction rendue asynchrone
    e.preventDefault();
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setLoginError(''); // Réinitialise l'erreur avant la tentative de connexion

    try {
      // ⬅️ Requête POST à l'API de connexion
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      const { token } = response.data;
      // ⬅️ Stockage du token dans le localStorage
      localStorage.setItem('jwtToken', token);

      // ⬅️ Redirection vers la page d'accueil ou de dashboard après une connexion réussie
      navigate('/dashboard'); 
      
    } catch (error) {
      console.error('Login error:', error);
      // ⬅️ Gestion des erreurs de l'API (e.g., 401 Unauthorized)
      const errorMessage = error.response?.data?.error || 'Login failed. Please check your credentials.';
      setLoginError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign in to Expensio" subtitle="Track your expenses and take control of your finances">
      <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up delay-100">
        {loginError && ( // ⬅️ Affichage de l'erreur de connexion de l'API
          <div className="bg-red-500 text-white p-3 rounded-md text-sm text-center">
            {loginError}
          </div>
        )}
        <Input 
          label="Email Address" 
          type="email" 
          name="email" 
          placeholder="your@email.com" 
          icon={<MailIcon size={18} />} 
          value={formData.email} 
          onChange={handleChange} 
          error={errors.email} 
          required 
        />
        <Input 
          label="Password" 
          type="password" 
          name="password" 
          placeholder="••••••••" 
          icon={<LockIcon size={18} />} 
          value={formData.password} 
          onChange={handleChange} 
          error={errors.password} 
          required 
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              name="rememberMe" 
              checked={formData.rememberMe} 
              onChange={handleChange} 
              className={`w-4 h-4 rounded focus:ring-primary-500 ${theme === 'dark' ? 'bg-dark-card border-gray-700 text-primary-500' : 'bg-gray-100 border-gray-300 text-primary-600'}`} 
            />
            <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Remember me
            </span>
          </label>
          <Link to="/forgot-password" className={`text-sm font-medium ${theme === 'dark' ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'} transition-colors duration-200`}>
            Forgot Password?
          </Link>
        </div>
        <Button type="submit" fullWidth isLoading={isLoading} className="mt-6">
          Sign in
        </Button>
        <SocialLogin />
        <p className={`text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Don't have an account?{' '}
          <Link to="/signup" className={`font-medium ${theme === 'dark' ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'} transition-colors duration-200`}>
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}