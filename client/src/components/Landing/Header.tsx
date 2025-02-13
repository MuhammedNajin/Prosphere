import { Rocket, Users, Building2, ArrowRight } from 'lucide-react';
import Logo from '../common/Logo/Logo';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const ProsphereHome = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const companies = [
    { name: 'Vodafone', logo: '/vodafone.logo.png' },
    { name: 'Intel', logo: '/intel.logo.png' },
    { name: 'Tesla', logo: '/tesla.logo.png' },
    { name: 'AMD', logo: '/amd.logo.png' },
    { name: 'Talkit', logo: '/tilkit.logo.png' },
  ];

  const features = [
    {
      icon: <Rocket className="w-6 h-6 text-orange-600" />,
      title: "Fast Recruitment",
      description: "Streamline your hiring process with our advanced matching algorithms"
    },
    {
      icon: <Users className="w-6 h-6 text-orange-600" />,
      title: "Top Talent Pool",
      description: "Access a curated network of skilled professionals across industries"
    },
    {
      icon: <Building2 className="w-6 h-6 text-orange-600" />,
      title: "Enterprise Solutions",
      description: "Customized recruitment solutions for businesses of all sizes"
    }
  ];

  const renderNavButtons = () => {
    if (!user) {
      return (
        <div className="flex items-center space-x-2 md:space-x-4">
          <button 
            onClick={() => navigate('/signin')}
            className="text-orange-600 hover:text-orange-700">
            Login
          </button>
          <button 
            onClick={() => navigate('/signup')}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
            Sign Up
          </button>
        </div>
      );
    }
    
    return (
      <div className="flex items-center space-x-2 md:space-x-4">
        <button 
          onClick={() => navigate('/contact')}
          className="text-orange-600 hover:text-orange-700">
          Contact Us
        </button>
        <button 
          onClick={() => navigate('/about')}
          className="text-orange-600 hover:text-orange-700">
          About Us
        </button>
        <button 
          onClick={() => navigate('/')}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center">
          Get Started
          <ArrowRight className="ml-2 w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center space-x-2">
          <Logo size="md" />
          <span className="text-xl font-semibold">Prosphere</span>
        </div>
        {renderNavButtons()}
      </nav>

      <main className="px-4 md:px-6 lg:px-8 max-w-6xl mx-auto mt-12 md:mt-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Transform Your
            <br />
            Hiring Experience with
            <br />
            <span className="text-orange-500">Prosphere</span>
          </h1>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Revolutionizing recruitment through innovative solutions that connect top talent with leading organizations.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {!user && (
            <button 
              onClick={() => navigate('/get-started')}
              className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 flex items-center mx-auto">
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="mt-24 mb-12">
          <p className="text-gray-600 text-center mb-8">Trusted by leading companies worldwide</p>
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
      </main>
    </div>
  );
};

export default ProsphereHome;