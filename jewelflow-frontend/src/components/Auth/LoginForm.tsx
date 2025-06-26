'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/app/services/api';

interface FieldErrors {
  email?: string;
  password?: string;
}

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const router = useRouter();

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Real-time field validation
  const validateField = (fieldName: 'email' | 'password', value: string) => {
    const newFieldErrors = { ...fieldErrors };

    switch (fieldName) {
      case 'email':
        if (!value.trim()) {
          newFieldErrors.email = 'Email is required';
        } else if (!validateEmail(value)) {
          newFieldErrors.email = 'Please enter a valid email address';
        } else {
          delete newFieldErrors.email;
        }
        break;
      case 'password':
        if (!value.trim()) {
          newFieldErrors.password = 'Password is required';
        } else if (value.length < 6) {
          newFieldErrors.password = 'Password must be at least 6 characters';
        } else {
          delete newFieldErrors.password;
        }
        break;
    }

    setFieldErrors(newFieldErrors);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateField('email', value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    validateField('password', value);
  };

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      e.stopPropagation();
      await performLogin();
    }
  };

  const handleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) {
      return;
    }
    
    await performLogin();
  };

  const performLogin = async () => {
    // Clear any existing errors first
    setError('');
    setFieldErrors({});
    setIsLoading(true);

    // Comprehensive client-side validation
    const newFieldErrors: FieldErrors = {};

    if (!email.trim()) {
      newFieldErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newFieldErrors.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
      newFieldErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newFieldErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      setIsLoading(false);
      return;
    }
    
    try {
      // Call the login API
      const response = await loginUser({ email, password });
      
      // Handle successful login
      console.log('Login successful:', response);

      // Store tokens with correct keys matching dashboard expectations
      if (response.access) {
        localStorage.setItem('authToken', response.access);
        localStorage.setItem('access_token', response.access);
        
        // Store refresh token based on remember me preference
        if (response.refresh) {
          if (rememberMe) {
            localStorage.setItem('refresh_token', response.refresh);
          } else {
            // Use sessionStorage for temporary sessions
            sessionStorage.setItem('refresh_token', response.refresh);
          }
        }

        // Store user data for dashboard
        const userData = {
          email: email,
          firstName: response.user?.first_name || '',
          lastName: response.user?.last_name || '',
          ...response.user
        };
        localStorage.setItem('userData', JSON.stringify(userData));

        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError('Login failed: Invalid response from server');
      }

    } catch (err: any) {
      console.error('Login error:', err);
      console.error('Error response:', err.response);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      
      // Handle specific error types
      if (err.response?.status === 401) {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else if (err.response?.status === 404) {
        setError('Account not found. Please check your email address or create a new account.');
      } else if (err.response?.status === 403) {
        setError('Account is temporarily locked. Please try again later or reset your password.');
      } else if (err.response?.status === 429) {
        setError('Too many login attempts. Please wait a moment before trying again.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        // Handle field-specific errors from backend
        const backendErrors = err.response?.data?.errors;
        if (backendErrors && typeof backendErrors === 'object') {
          const newFieldErrors: FieldErrors = {};
          if (backendErrors.email) {
            newFieldErrors.email = Array.isArray(backendErrors.email) 
              ? backendErrors.email[0] 
              : backendErrors.email;
          }
          if (backendErrors.password) {
            newFieldErrors.password = Array.isArray(backendErrors.password) 
              ? backendErrors.password[0] 
              : backendErrors.password;
          }
          setFieldErrors(newFieldErrors);
        }
        
        // Fallback error message
        setError(
          err.response?.data?.detail || 
          err.response?.data?.message ||
          err.message || 
          'Failed to log in. Please check your credentials and try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 p-4 rounded-xl text-sm">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
  
      {/* Main Login Form */}
      <div className="liquid-glass rounded-3xl p-8 shadow-2xl">
        <form className="space-y-6" noValidate>
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              onKeyDown={handleKeyDown}
              className={`w-full px-4 py-3 rounded-xl liquid-glass-subtle border-0 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-300 ${
                fieldErrors.email 
                  ? 'focus:ring-red-500 ring-1 ring-red-500' 
                  : 'focus:ring-blue-500'
              }`}
              placeholder="Enter your email"
              required
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <Link href="/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={handlePasswordChange}
                onKeyDown={handleKeyDown}
                className={`w-full px-4 py-3 rounded-xl liquid-glass-subtle border-0 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-300 pr-12 ${
                  fieldErrors.password 
                    ? 'focus:ring-red-500 ring-1 ring-red-500' 
                    : 'focus:ring-blue-500'
                }`}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l14.5 14.5a.75.75 0 1 0 1.06-1.06l-1.745-1.745a10.029 10.029 0 0 0 3.3-4.38 1.651 1.651 0 0 0 0-1.185A10.004 10.004 0 0 0 9.999 3a9.956 9.956 0 0 0-4.744 1.194L3.28 2.22ZM7.752 6.69l1.092 1.092a2.5 2.5 0 0 1 3.374 3.373l1.091 1.092a4 4 0 0 0-5.557-5.557Z" clipRule="evenodd" />
                    <path d="m10.748 13.93 2.523 2.523a9.987 9.987 0 0 1-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 0 1 0-1.186A10.007 10.007 0 0 1 2.839 6.02L6.07 9.252a4 4 0 0 0 4.678 4.678Z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                    <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <div className="relative flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 appearance-none bg-black dark:bg-gray-900 border-2 border-blue-500 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 checked:bg-blue-600 checked:border-blue-600 transition-all duration-200"
              />
              {rememberMe && (
                <svg
                  className="w-3 h-3 text-white absolute left-0.5 top-0.5 pointer-events-none"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <label htmlFor="remember-me" className="ml-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              Remember me
            </label>
          </div>

          {/* Sign In Button */}
          <button
            type="button"
            onClick={handleButtonClick}
            disabled={isLoading}
            className={`w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-xl btn-liquid shadow-2xl hover:shadow-xl transition-all duration-300 ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            <span className="flex items-center justify-center space-x-2">
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </span>
          </button>
        </form>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300/30 dark:border-gray-600/30" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white/10 dark:bg-black/10 text-gray-500 dark:text-gray-400 rounded-full backdrop-blur-sm">
            New to JewelFlow?
          </span>
        </div>
      </div>

      {/* New User Button */}
      <div className="liquid-glass-subtle rounded-3xl p-6 text-center shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Create your account
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Join thousands of jewelry businesses worldwide
        </p>
        <Link
          href="/signup"
          className="w-full inline-flex items-center justify-center px-6 py-3 liquid-glass text-gray-700 dark:text-gray-300 font-semibold rounded-xl btn-liquid shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <span className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Create Account</span>
          </span>
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
