import { useState, useEffect } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import Logo from '../common/Logo/Logo';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import FeatureCards from './FeaturesCard';

const ProsphereHome = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const companies = [
    { name: 'Vodafone', logo: '/vodafone.logo.png' },
    { name: 'Intel', logo: '/intel.logo.png' },
    { name: 'Tesla', logo: '/tesla.logo.png' },
    { name: 'AMD', logo: '/amd.logo.png' },
    { name: 'Talkit', logo: '/tilkit.logo.png' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const renderNavButtons = () => {
    if (!user) {
      return (
        <div className="hidden md:flex items-center space-x-6">
          <button 
            onClick={() => navigate('/signin')}
            className="text-orange-600 hover:text-orange-700 font-medium transition duration-300">
            Login
          </button>
          <button 
            onClick={() => navigate('/signup')}
            className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 shadow-md hover:shadow-lg transition duration-300">
            Sign Up
          </button>
        </div>
      );
    }
    
    return (
      <div className="hidden md:flex items-center space-x-6">
        <button 
          onClick={() => navigate('/contact')}
          className="text-orange-600 hover:text-orange-700 font-medium transition duration-300">
          Contact
        </button>
        <button 
          onClick={() => navigate('/about')}
          className="text-orange-600 hover:text-orange-700 font-medium transition duration-300">
          About
        </button>
        <button 
          onClick={() => navigate('/')}
          className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 shadow-md hover:shadow-lg transition duration-300 flex items-center">
          Get Started
          <ArrowRight className="ml-2 w-4 h-4" />
        </button>
      </div>
    );
  };

  const renderMobileMenu = () => {
    return (
      <div className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="absolute inset-0 bg-white">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center space-x-2">
              <Logo size="md" />
              <span className="text-xl font-semibold">Prosphere</span>
            </div>
            <button onClick={toggleMenu} className="p-2">
              <X className="w-6 h-6 text-gray-800" />
            </button>
          </div>
          <div className="flex flex-col space-y-4 p-6">
            {!user ? (
              <>
                <button 
                  onClick={() => {
                    navigate('/signin');
                    toggleMenu();
                  }}
                  className="text-lg text-gray-800 py-3 border-b border-gray-200">
                  Login
                </button>
                <button 
                  onClick={() => {
                    navigate('/signup');
                    toggleMenu();
                  }}
                  className="text-lg text-gray-800 py-3 border-b border-gray-200">
                  Sign Up
                </button>
                <button 
                  onClick={() => {
                    navigate('/get-started');
                    toggleMenu();
                  }}
                  className="bg-orange-600 text-white px-4 py-3 mt-4 rounded-full">
                  Get Started Today
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => {
                    navigate('/contact');
                    toggleMenu();
                  }}
                  className="text-lg text-gray-800 py-3 border-b border-gray-200">
                  Contact
                </button>
                <button 
                  onClick={() => {
                    navigate('/about');
                    toggleMenu();
                  }}
                  className="text-lg text-gray-800 py-3 border-b border-gray-200">
                  About
                </button>
                <button 
                  onClick={() => {
                    navigate('/');
                    toggleMenu();
                  }}
                  className="bg-orange-600 text-white px-4 py-3 mt-4 rounded-full flex items-center justify-center">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">

      <nav className={`fixed w-full z-30 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Logo size="md" />
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">Prosphere</span>
            </div>
            
            {renderNavButtons()}
            
            <button className="md:hidden" onClick={toggleMenu}>
              <Menu className="w-6 h-6 text-gray-800" />
            </button>
          </div>
        </div>
      </nav>
      
      {renderMobileMenu()}

      <div className="pt-24 md:pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Transform Your
                <span className="block mt-2">Hiring Experience with</span>
                <span className="text-orange-600 block mt-2">Prosphere</span>
              </h1>
              <p className="text-gray-600 text-lg mb-8 max-w-lg">
                Revolutionizing recruitment through innovative solutions that connect top talent with leading organizations.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate('/get-started')}
                  className="bg-orange-600 text-white px-8 py-3 rounded-full hover:bg-orange-700 shadow-lg hover:shadow-xl flex items-center transition duration-300">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
                <button 
                  onClick={() => navigate('/learn-more')}
                  className="px-8 py-3 border border-orange-600 text-orange-600 rounded-full hover:bg-orange-50 transition duration-300">
                  Learn More
                </button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="relative">
                  <img 
                    src="/landingpage.png" 
                    alt="Prosphere Platform" 
                    className="rounded-xl shadow-sm
                     "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FeatureCards />
      
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600 text-center font-medium mb-8">Trusted by leading companies worldwide</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center">
            {companies.map((company, index) => (
              <img
                key={index}
                src={company.logo}
                alt={company.name}
                className="h-10 opacity-50 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProsphereHome;