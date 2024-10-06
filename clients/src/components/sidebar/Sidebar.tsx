import React from "react";

interface SidebarProps {
   Header?: React.ReactNode;
   children: React.ReactNode;
   className?:string;
}

export const Sidebar: React.FC<SidebarProps> = ({ Header, children, className }) => {
    const style = className || "w-64 bg-white rounded-lg p-4 space-y-4"
    return (
        <aside className={style}>
          {Header}
          {children}
        </aside>
      );
}
