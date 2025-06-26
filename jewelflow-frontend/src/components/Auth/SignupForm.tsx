'use client';

import { useState } from 'react';
import Link from 'next/link';
import { register } from '@/app/services/api';
import { useRouter } from 'next/navigation';

interface FieldErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

const SignupForm = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): { isValid: boolean; message?: string } => {
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      return { isValid: false, message: 'Password must contain both uppercase and lowercase letters' };
    }
    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }
    return { isValid: true };
  };

  // Real-time field validation
  const validateField = (fieldName: keyof FieldErrors, value: string) => {
    const newFieldErrors = { ...fieldErrors };

    switch (fieldName) {
      case 'firstName':
        if (!value.trim()) {
          newFieldErrors.firstName = 'First name is required';
        } else if (value.trim().length < 2) {
          newFieldErrors.firstName = 'First name must be at least 2 characters';
        } else {
          delete newFieldErrors.firstName;
        }
        break;
      case 'lastName':
        if (!value.trim()) {
          newFieldErrors.lastName = 'Last name is required';
        } else if (value.trim().length < 2) {
          newFieldErrors.lastName = 'Last name must be at least 2 characters';
        } else {
          delete newFieldErrors.lastName;
        }
        break;
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
        const passwordValidation = validatePassword(value);
        if (!passwordValidation.isValid) {
          newFieldErrors.password = passwordValidation.message;
        } else {
          delete newFieldErrors.password;
        }
        // Also validate confirm password if it exists
        if (confirmPassword && value !== confirmPassword) {
          newFieldErrors.confirmPassword = 'Passwords do not match';
        } else if (confirmPassword && value === confirmPassword) {
          delete newFieldErrors.confirmPassword;
        }
        break;
      case 'confirmPassword':
        if (!value.trim()) {
          newFieldErrors.confirmPassword = 'Please confirm your password';
        } else if (value !== password) {
          newFieldErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newFieldErrors.confirmPassword;
        }
        break;
    }

    setFieldErrors(newFieldErrors);
  };

  // Field change handlers
  const handleFieldChange = (fieldName: keyof FieldErrors, setValue: (value: string) => void) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValue(value);
      validateField(fieldName, value);
    };

  // Check if form is complete and valid
  const isFormComplete = () => {
    return (
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      email.trim() !== '' &&
      password.trim() !== '' &&
      confirmPassword.trim() !== '' &&
      password === confirmPassword &&
      acceptTerms &&
      Object.keys(fieldErrors).length === 0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    // Comprehensive validation
    const newFieldErrors: FieldErrors = {};

    if (!firstName.trim()) {
      newFieldErrors.firstName = 'First name is required';
    } else if (firstName.trim().length < 2) {
      newFieldErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!lastName.trim()) {
      newFieldErrors.lastName = 'Last name is required';
    } else if (lastName.trim().length < 2) {
      newFieldErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (!email.trim()) {
      newFieldErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newFieldErrors.email = 'Please enter a valid email address';
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      newFieldErrors.password = passwordValidation.message;
    }

    if (!confirmPassword.trim()) {
      newFieldErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newFieldErrors.confirmPassword = 'Passwords do not match';
    }

    if (!acceptTerms) {
      newFieldErrors.terms = 'You must accept the terms and conditions';
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const userData = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
      };
      await register(userData);
      setSuccess('Account created successfully! Redirecting to login...');
      // Clear form
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setAcceptTerms(false);
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle specific error types
      if (error.response?.status === 400) {
        const backendErrors = error.response?.data?.errors;
        if (backendErrors && typeof backendErrors === 'object') {
          const newFieldErrors: FieldErrors = {};
          if (backendErrors.email) {
            newFieldErrors.email = Array.isArray(backendErrors.email) 
              ? backendErrors.email[0] 
              : backendErrors.email;
          }
          if (backendErrors.first_name) {
            newFieldErrors.firstName = Array.isArray(backendErrors.first_name) 
              ? backendErrors.first_name[0] 
              : backendErrors.first_name;
          }
          if (backendErrors.last_name) {
            newFieldErrors.lastName = Array.isArray(backendErrors.last_name) 
              ? backendErrors.last_name[0] 
              : backendErrors.last_name;
          }
          if (backendErrors.password) {
            newFieldErrors.password = Array.isArray(backendErrors.password) 
              ? backendErrors.password[0] 
              : backendErrors.password;
          }
          setFieldErrors(newFieldErrors);
        }
        
        if (error.response?.data?.email) {
          setError('An account with this email already exists. Please use a different email or try signing in.');
        } else {
          setError(error.response?.data?.message || 'Registration failed. Please check your information and try again.');
        }
      } else if (error.response?.status === 409) {
        setError('An account with this email already exists. Please use a different email or try signing in.');
      } else if (error.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError(error.response?.data?.message || "Registration failed. Please try again.");
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

      {/* Success Message */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-300 p-4 rounded-xl text-sm">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{success}</span>
          </div>
        </div>
      )}

      {/* Main Signup Form */}
      <form onSubmit={handleSubmit} className="liquid-glass rounded-3xl p-8 shadow-2xl">
        <div className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={handleFieldChange('firstName', setFirstName)}
                className={`w-full px-4 py-3 rounded-xl liquid-glass-subtle border-0 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-300 ${
                  fieldErrors.firstName 
                    ? 'focus:ring-red-500 ring-1 ring-red-500' 
                    : 'focus:ring-blue-500'
                }`}
                placeholder="Enter your first name"
                required
              />
              {fieldErrors.firstName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.firstName}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={handleFieldChange('lastName', setLastName)}
                className={`w-full px-4 py-3 rounded-xl liquid-glass-subtle border-0 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-300 ${
                  fieldErrors.lastName 
                    ? 'focus:ring-red-500 ring-1 ring-red-500' 
                    : 'focus:ring-blue-500'
                }`}
                placeholder="Enter your last name"
                required
              />
              {fieldErrors.lastName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleFieldChange('email', setEmail)}
              className={`w-full px-4 py-3 rounded-xl liquid-glass-subtle border-0 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-300 ${
                fieldErrors.email 
                  ? 'focus:ring-red-500 ring-1 ring-red-500' 
                  : 'focus:ring-blue-500'
              }`}
              placeholder="Enter your email address"
              required
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={handleFieldChange('password', setPassword)}
                className={`w-full px-4 py-3 pr-12 rounded-xl liquid-glass-subtle border-0 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-300 ${
                  fieldErrors.password 
                    ? 'focus:ring-red-500 ring-1 ring-red-500' 
                    : 'focus:ring-blue-500'
                }`}
                placeholder="Create a strong password"
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

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleFieldChange('confirmPassword', setConfirmPassword)}
                className={`w-full px-4 py-3 pr-12 rounded-xl liquid-glass-subtle border-0 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-300 ${
                  fieldErrors.confirmPassword 
                    ? 'focus:ring-red-500 ring-1 ring-red-500' 
                    : 'focus:ring-blue-500'
                }`}
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                {showConfirmPassword ? (
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
            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center">
              <input
                id="acceptTerms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 appearance-none bg-black dark:bg-gray-900 border-2 border-blue-500 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 checked:bg-blue-600 checked:border-blue-600 transition-all duration-200"
                required
              />
              {acceptTerms && (
                <svg
                  className="w-3 h-3 text-white absolute left-0.5 top-0.5 pointer-events-none"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <label htmlFor="acceptTerms" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                I agree to the{' '}
                <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Privacy Policy
                </Link>
              </label>
              {fieldErrors.terms && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.terms}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormComplete() || isLoading || !!success}
            className={`w-full py-3 px-6 font-semibold rounded-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${
              isFormComplete() && !success
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white btn-liquid hover:scale-105 shadow-xl'
                : 'liquid-glass-subtle border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center space-x-2">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating Account...</span>
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </div>
      </form>

      {/* Login Link */}
      <div className="text-center">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600 opacity-50" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent text-gray-500 dark:text-gray-400">
              Already have an account?
            </span>
          </div>
        </div>

        <div className="mt-4">
          <div className="liquid-glass-subtle rounded-2xl p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Welcome back! Sign in to your account.
            </p>
            <Link
              href="/login"
              className="inline-block liquid-glass-subtle border-2 border-blue-500/50 text-blue-600 dark:text-blue-400 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 py-2 px-6 font-medium rounded-xl hover:scale-105 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
