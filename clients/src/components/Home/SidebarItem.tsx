import react from 'react'



const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; badge?: number }> = ({ icon, label, badge }) => (
    <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
      {icon}
      <span>{label}</span>
      {badge && <span className="bg-red-500 text-white text-xs rounded-full px-2 ml-auto">{badge}</span>}
    </div>
  );

  export default SidebarItem;