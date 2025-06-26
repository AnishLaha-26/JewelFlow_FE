import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: 'JewelFlow - Jewelry Management System',
  description: 'Your comprehensive jewelry management application',
  openGraph: {
    title: 'JewelFlow - Jewelry Management System',
    description: 'Your comprehensive jewelry management application',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'JewelFlow - Jewelry Management System',
      },
    ],
  },
};

// Modern liquid glass logo component
const Logo = () => (
  <div className="flex items-center justify-center mb-12">
    <div className="relative p-6 rounded-3xl liquid-glass animate-float shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-3xl animate-pulse" />
      <div className="relative flex items-center space-x-4">
        <div className="relative">
          <Image 
            src="/logo.png" 
            alt="JewelFlow Logo" 
            width={64} 
            height={64} 
            className="rounded-2xl shadow-lg" 
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold gradient-text">JewelFlow</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Jewelry Management</p>
        </div>
      </div>
    </div>
  </div>
);

// Liquid glass feature card component
const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
  <div className="card-liquid rounded-3xl p-8 text-center">
    <div className="text-5xl mb-6">{icon}</div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
  </div>
);

const HomePage = () => {
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
          <div className="flex items-center space-x-3">
            <Image 
              src="/logo.png" 
              alt="JewelFlow Logo" 
              width={40} 
              height={40} 
              className="rounded-2xl shadow-lg" 
            />
            <span className="font-bold text-xl text-gray-900 dark:text-gray-100">JewelFlow</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Logo />
            
            <div className="max-w-4xl mx-auto mb-12">
              <h2 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-gray-100 mb-8 tracking-tight leading-tight">
                Welcome to the future of{' '}
                <span className="gradient-text">jewelry management</span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
                Experience the power of modern design with our comprehensive jewelry management platform. 
                Streamline your business with liquid glass elegance.
              </p>
            </div>

            {/* Action Button */}
            <div className="flex justify-center mb-16">
              <Link
                href="/login"
                className="group relative px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-2xl btn-liquid shadow-2xl"
              >
                <span className="relative z-10 flex items-center space-x-3">
                  <span>Get Started</span>
                  <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            <FeatureCard
              icon="💎"
              title="Smart Inventory"
              description="AI-powered categorization and real-time tracking of your precious jewelry collection with advanced analytics."
            />
            <FeatureCard
              icon="📊"
              title="Business Intelligence"
              description="Comprehensive insights and beautiful reports to help you make data-driven decisions for growth."
            />
            <FeatureCard
              icon="🔒"
              title="Bank-Level Security"
              description="Your valuable data is protected with enterprise-grade encryption and multi-layer security protocols."
            />
          </div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="liquid-glass rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Why Choose JewelFlow?</h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Intuitive liquid glass interface</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Real-time inventory synchronization</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span>Advanced analytics dashboard</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span>Multi-platform compatibility</span>
                </li>
              </ul>
            </div>
            
            <div className="liquid-glass rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Get Started Today</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Join thousands of jewelry businesses worldwide who trust JewelFlow to manage their operations with style and efficiency.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Trusted by 10,000+ users</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="liquid-glass-subtle rounded-3xl p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              &copy; 2024 JewelFlow. Crafted with &hearts; and liquid glass design for jewelry businesses worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
