import React from "react";
import { useSelectedCompany } from "@/hooks/useSelectedCompany";
import { Bell, Plus, ShieldCheck } from "lucide-react";
import CompanyDropdown from "./Dropdown";

interface CompanyHeaderProps {
   onClose: React.Dispatch<React.SetStateAction<boolean>>
}

const Header: React.FC<CompanyHeaderProps> = ({ onClose }) => {
  const company = useSelectedCompany();
  return (
    <header className="flex overflow-hidden fixed w-full md:max-w-[80%] z-50 flex-wrap gap-10 justify-between items-center px-6 py-4 bg-white  max-md:px-5 border-b shadow-sm border-solid">
       <div className="flex gap-4">
       {/* <img
        loading="lazy"
        src={""}
        alt="Company Logo"
        className="object-contain shrink-0 self-stretch my-auto w-12 aspect-square"
      /> */}
      <div className={`w-12 h-12 text-lg  bg-gradient-to-br from-green-300 to-green-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg`}>
      <span className="select-none capitalize">{company && company?.name[0] || 'C'}</span>
    </div>
      <div className="flex flex-col self-stretch my-auto">
        <div className="text-base leading-relaxed  text-accent-purple">Company</div>
        <div className="flex gap-2 items-start text-xl font-semibold leading-tight text-gray-800">
          <div className="capitalize text-orange-950">{(company && company?.name) || "NA"}</div>
          { company?.verified && <ShieldCheck size={18} className="self-center text-accent-green"/>}
        </div>
      </div>
       </div>
      <div className="flex gap-8 justify-center items-center self-stretch my-auto">
        
        {/* <button className="flex gap-2.5 justify-center items-center self-stretch px-4 py-2 my-auto bg-orange-700 rounded-full text-base font-bold leading-relaxed text-center text-white">
         
        </button> */}
        <CompanyDropdown onClose={onClose} />
      </div>
    </header>
  );
};

export default Header;
