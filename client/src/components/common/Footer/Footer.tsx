import { Facebook, Instagram, Twitter, Linkedin, Globe } from 'lucide-react';
import Logo from '../Logo/Logo';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-orange-900 to-orange-950 text-orange-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Logo size="sm" />
              <span className="text-white text-xl font-semibold">Prosphere</span>
            </div>
            <p className="text-sm leading-relaxed text-orange-200">
              Revolutionizing recruitment through innovative solutions that connect top talent with leading organizations.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">About</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-orange-200 hover:text-orange-400 transition-colors">Companies</a></li>
              <li><a href="#" className="text-sm text-orange-200 hover:text-orange-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="text-sm text-orange-200 hover:text-orange-400 transition-colors">Terms</a></li>
              <li><a href="#" className="text-sm text-orange-200 hover:text-orange-400 transition-colors">Advice</a></li>
              <li><a href="#" className="text-sm text-orange-200 hover:text-orange-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-orange-200 hover:text-orange-400 transition-colors">Help Docs</a></li>
              <li><a href="#" className="text-sm text-orange-200 hover:text-orange-400 transition-colors">Guide</a></li>
              <li><a href="#" className="text-sm text-orange-200 hover:text-orange-400 transition-colors">Updates</a></li>
              <li><a href="#" className="text-sm text-orange-200 hover:text-orange-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-orange-200 hover:text-orange-400 transition-colors">Schedule Demo</a></li>
              <li><a href="#" className="text-sm text-orange-200 hover:text-orange-400 transition-colors">Talk to Sales</a></li>
              <li><a href="#" className="text-sm text-orange-200 hover:text-orange-400 transition-colors">Support</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-orange-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-orange-200">
            © 2025 Prosphere. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-orange-300 hover:text-orange-400 transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-orange-300 hover:text-orange-400 transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-orange-300 hover:text-orange-400 transition-colors">
              <Globe size={20} />
            </a>
            <a href="#" className="text-orange-300 hover:text-orange-400 transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="#" className="text-orange-300 hover:text-orange-400 transition-colors">
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;