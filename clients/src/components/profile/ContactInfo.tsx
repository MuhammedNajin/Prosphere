import React from 'react';
import { Mail, Phone, User, Briefcase, MapPin } from 'lucide-react';
import { useSelector } from 'react-redux';

const ContactInfoModalContent = () => {

    const { user } = useSelector((state) => state.auth);
  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
          <User size={48} className="text-gray-500" />
        </div>
        <h2 className="text-2xl font-bold">{user.username}</h2>
        <p className="text-gray-500">{user.jobRole}</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Mail className="text-blue-500" size={20} />
          <a href={`mailto:${user.email}`} className="text-blue-500 hover:underline">
            {user.email}
          </a>
        </div>
        
        <div className="flex items-center space-x-3">
          <Phone className="text-green-500" size={20} />
          <a href={`tel:${user.phone}`} className="text-green-500 hover:underline">
            {user.phone}
          </a>
        </div>
        
        <div className="flex items-center space-x-3">
          <Briefcase className="text-purple-500" size={20} />
          <span>{user.company}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <MapPin className="text-red-500" size={20} />
          <span>{user.location}</span>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoModalContent;