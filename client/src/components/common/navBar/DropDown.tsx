import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChevronDown, LogOut, Settings, UserRound } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logoutThuck } from '@/redux/action/actions';
import { useNavigate } from 'react-router-dom';
import { useGetUser } from '@/hooks/useGetUser';
import { AppDispatch } from '@/redux/store';
import { useQuery } from 'react-query';
import { ProfileApi } from '@/api/Profile.api';

const Dropdown = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const loggedUser = useGetUser();
  
  const { data: avatarUrl, isLoading } = useQuery({
    queryKey: ["avatar", loggedUser?.avatar],
    queryFn: () => {
      if (!loggedUser?.avatar) return null;
      return ProfileApi.getUploadedFile(loggedUser.avatar);
    },
    enabled: !!loggedUser?.avatar,
  });
  
  const logoutHandler = () => {
    dispatch(logoutThuck())
      .unwrap()
      .then(() => {
        navigate("/signin");
      });
  };

  // Determine the image source based on API result or fallback
  const imageSource = avatarUrl || '/profleIcon.png';
  const username = loggedUser?.username || 'Maria Anderson';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex bg-gray-100 items-center gap-2 px-2 py-1 md:px-2 md:py-2 hover:bg-gray-200 rounded-full transition-colors outline-none shadow-sm min-w-28 justify-between">
        <Avatar className="h-8 w-8">
          {isLoading ? (
            <AvatarFallback>{username.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
          ) : (
            <>
              <AvatarImage src={imageSource} alt={username} />
              <AvatarFallback>{username.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
            </>
          )}
        </Avatar>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium hidden sm:inline">{username}</span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => navigate('profile')} 
          className="cursor-pointer">
          <UserRound className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate('/settings')} 
          className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
        onClick={logoutHandler}
         className="cursor-pointer text-red-500 hover:text-red-800">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Dropdown;