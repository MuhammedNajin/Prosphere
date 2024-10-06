import react from "react";

export const SidebarItem: React.FC<{
  icon?: React.ReactNode;
  label: string;
  badge?: number;
  className?: string;
  badgeStyle?: string;
}> = ({ icon, label, badge, className, badgeStyle }) => {
  const style =
    className ||
    "flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer";
  const bstyle =
    badgeStyle || "bg-red-500 text-white text-xs rounded-full px-2 ml-auto";

  return (
    <div className={style}>
      {icon}
     <h1 className="text-zinc-500 hover:text-black cursor-pointer">{label}</h1>
      {badge && <span className={bstyle}>{badge}</span>}
    </div>
  );
};
