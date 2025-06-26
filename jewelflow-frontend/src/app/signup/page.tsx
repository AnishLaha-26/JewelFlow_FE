import { Metadata } from 'next';
import SignupForm from '@/components/Auth/SignupForm';
import Image from 'next/image';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: 'Sign Up - JewelFlow',
  description: 'Create your JewelFlow account to manage your jewelry business',
};

const SignupPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Liquid background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/50" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-blue-300/20 to-purple-300/20 dark:from-blue-600/20 dark:to-purple-600/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-32 right-10 w-96 h-96 bg-gradient-to-r from-purple-300/20 to-pink-300/20 dark:from-purple-600/20 dark:to-pink-600/20 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-200/10 to-purple-200/10 dark:from-blue-700/10 dark:to-purple-700/10 rounded-full blur-3xl" />
      
      {/* Header */}
      <header className="relative z-20 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Image 
              src="/logo.png" 
              alt="JewelFlow Logo" 
              width={40} 
              height={40} 
              className="rounded-2xl shadow-lg" 
            />
            <span className="font-bold text-xl text-gray-900 dark:text-gray-100">JewelFlow</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative p-4 rounded-3xl liquid-glass animate-float">
                <div className="flex items-center space-x-3">
                  <Image 
                    src="/logo.png" 
                    alt="JewelFlow Logo" 
                    width={48} 
                    height={48} 
                    className="rounded-2xl shadow-lg" 
                  />
                  <div>
                    <h1 className="text-2xl font-bold gradient-text">JewelFlow</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Jewelry Management</p>
                  </div>
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Create your account
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Join thousands of jewelry businesses worldwide
            </p>
          </div>

          {/* Signup Form */}
          <SignupForm />
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
