import React from "react";

interface SidebarItemProps {
    className?: string;
    children: React.ReactNode;
}
export const  SidebarItemWrapper:React.FC<SidebarItemProps> = ({ className, children }) => {
  const style = className || "space-y-2";
  return <nav className={style}>{children}</nav>;
}
