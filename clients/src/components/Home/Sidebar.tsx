import { Award, Briefcase, Building, Home, MessageCircle, Users } from "lucide-react";
import SidebarItem from "./SidebarItem";

const Sidebar: React.FC = () => (
    <aside className="w-72 hidden md:block h-96 bg-white rounded-lg p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <img src="Loginpage.image.png" alt="Muhammed Najin N" className="w-8 h-8 rounded-full" />
        <span className="font-medium">Muhammed Najin N</span>
      </div>
      <nav className="space-y-2">
        <SidebarItem  icon={<Home size={20} />} label="Home" />
        <SidebarItem icon={<Users size={20} />} label="My connections" badge={4} />
        <SidebarItem icon={<Briefcase size={20} />} label="Jobs" badge={6} />
        <SidebarItem icon={<MessageCircle size={20} />} label="Talk" badge={2} />
        <SidebarItem icon={<Award size={20} />} label="Get Premium" />
        <SidebarItem icon={<Building size={20} />} label="My companies" />
      
      </nav>
    </aside>
  );

  export default Sidebar