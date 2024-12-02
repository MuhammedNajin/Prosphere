import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChevronDown, LogOut, Plus, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { setSelectedCompany } from '@/redux/reducers/companySlice';
import { useDispatch } from 'react-redux';

interface CompanyDropdownProps {
   onClose: React.Dispatch<React.SetStateAction<boolean>>
}
const CompanyDropdown:React.FC<CompanyDropdownProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex bg-gray-200 items-center gap-2 px-2 py-1 md:px-2 md:py-2 hover:bg-gray-400 rounded-full transition-colors outline-none shadow-sm min-w-28 justify-between">
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://github.com/shadcn.png" alt="User" />
          <AvatarFallback>MA</AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium hidden sm:inline">Maria Anderson</span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
         onClick={() => onClose(true)}
         className="cursor-pointer">
        <Plus size={20} />
        <span className="self-stretch my-auto">Post a job</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
         onClick={() =>{
          dispatch(setSelectedCompany(null));
          navigate('/mycompany')
         } }
        className="cursor-pointer text-accent-blue">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Switch to User View</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CompanyDropdown;