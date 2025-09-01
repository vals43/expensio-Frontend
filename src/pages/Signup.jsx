import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MailIcon, LockIcon, UserIcon } from 'lucide-react';
import { AuthLayout } from '../components/layout/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { SocialLogin } from '../components/SocialLogin';
import { useTheme } from '../components/theme/ThemeProvider';
import axios from 'axios';
import { login } from '../api/auth/authService';

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

export function Signup() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [signupError, setSignupError] = useState('');

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear errors on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
    if (signupError) setSignupError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setSignupError('');

    try {
      await axios.post(`${BACKEND_URL}/api/auth/signup`, {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password
      });      
      await login({ email: formData.email.trim(), password: formData.password });

      navigate('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.error || 'Signup failed. Please try again.';
      setSignupError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create an account" subtitle="Start tracking your expenses in minutes">
      <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up delay-100">
        {signupError && (
          <div className="bg-red-500 text-white p-3 rounded-md text-sm text-center">
            {signupError}
          </div>
        )}
        <Input
          label="First Name"
          type="text"
          name="firstName"
          placeholder="John"
          icon={<UserIcon size={18} />}
          value={formData.firstName}
          onChange={handleChange}
          error={errors.firstName}
          required
        />
        <Input
          label="Last Name"
          type="text"
          name="lastName"
          placeholder="Doe"
          icon={<UserIcon size={18} />}
          value={formData.lastName}
          onChange={handleChange}
          error={errors.lastName}
          required
        />
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
        <div className="mt-4">
          <label className="flex items-start">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className={`w-4 h-4 mt-1 rounded focus:ring-primary-500 ${
                theme === 'dark'
                  ? 'bg-dark-card border-gray-700 text-primary-500'
                  : 'bg-gray-100 border-gray-300 text-primary-600'
              }`}
            />
            <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              I agree to the{' '}
              <Link to="/terms" className="text-primary-500 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary-500 hover:underline">
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.agreeToTerms && (
            <p className="text-red-500 text-xs mt-1 animate-slide-up">{errors.agreeToTerms}</p>
          )}
        </div>
        <Button type="submit" fullWidth isLoading={isLoading} className="mt-6">
          Create account
        </Button>
        <SocialLogin />
        <p className={`text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Already have an account?{' '}
          <Link
            to="/login"
            className={`font-medium ${
              theme === 'dark'
                ? 'text-primary-400 hover:text-primary-300'
                : 'text-primary-600 hover:text-primary-700'
            } transition-colors duration-200`}
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
