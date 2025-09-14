import  { useEffect } from "react";
import {
  Users,
  Search,
  UserX,
  Mail,
  Phone,
  Briefcase
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AddMemberModal from "./AddMemberModal";
import { useQuery } from "react-query";
import { CompanyApi } from "@/api";
import { useCurrentCompany } from "@/hooks/useSelectedCompany";
import { IUser } from "@/types/user";

const PublicMemberDirectory = () => {
  const company = useCurrentCompany();
  const employees = useQuery({
    queryKey: ['people'],
     queryFn: () => CompanyApi.getCompanyEmployees(company?.id as string)
  })

  useEffect(() => {
     console.log('!!!!!!!!!!!!!!!!!!!!!!!!!', employees.data);
  }, [employees.data])

  const onSuccessCallback = () => {
     // Refetch the employees data when a new member is added
     employees.refetch();
  }

  const getInitial = (username: string) => {
    return username ? username[0].toUpperCase() : "U";
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "";
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
  };

  // Show loading state
  if (employees.isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading team members...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (employees.isError) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Error loading team members</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Our Team
          </h1>
          <p className="text-gray-500 mt-2">
            Meet our talented professionals
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              className="pl-10 w-[300px]"
              placeholder="Search team members..."
            />
          </div>
          <AddMemberModal onSuccess={onSuccessCallback}/>
        </div>
      </div>

      {employees.data?.team && employees.data.team.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.data.team.map(({ userId: user }: { userId: IUser}) => (
             <Card key={user.id || user.email} className="w-full max-w-sm transform transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white dark:bg-zinc-900">
             <CardHeader className="pt-6 pb-4">
               <div className="relative flex flex-col items-center">
            
                 <div className="absolute top-0 right-0">
                   <div className="h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-zinc-900" />
                 </div>
                 
                 <div className="p-1 rounded-full bg-gradient-to-r from-orange-400 to-orange-600">
                   <Avatar className="h-24 w-24 border-4 border-white dark:border-zinc-900">
                     <AvatarImage src={user.profileImageKey ?? ''} alt={user.username} />
                     <AvatarFallback className="text-2xl font-bold bg-orange-100 text-orange-700">
                       {getInitial(user.username)}
                     </AvatarFallback>
                   </Avatar>
                 </div>

                 <div className="mt-4 text-center">
                   <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                     {user.username}
                   </h3>
                   {user.about && (
                     <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                       {user.about}
                     </p>
                   )}
                 </div>
               </div>
             </CardHeader>
       
             <CardContent className="pb-4">
               <div className="space-y-3">
                 <div className="flex items-center space-x-3 text-sm text-zinc-600 dark:text-zinc-300">
                   <Mail className="h-4 w-4 text-orange-600" />
                   <span className="truncate">{user.email}</span>
                 </div>
                 <div className="flex items-center space-x-3 text-sm text-zinc-600 dark:text-zinc-300">
                   <Phone className="h-4 w-4 text-orange-600" />
                   <span>{formatPhoneNumber(user.phone)}</span>
                 </div>
                 <div className="flex items-center space-x-3 text-sm text-zinc-600 dark:text-zinc-300">
                   <Briefcase className="h-4 w-4 text-orange-600" />
                   <span>{user.headline}</span>
                 </div>
               </div>
             </CardContent>
       
             <CardFooter className="pt-2 pb-6">
               <div className="w-full flex gap-2">
                 <Button 
                   className="flex-1 bg-orange-600 hover:bg-orange-700 text-white transition-colors duration-200"
                   variant="default"
                 >
                   View Profile
                 </Button>
                 <Button 
                   className="flex-1 border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                   variant="outline"
                 >
                   Message
                 </Button>
               </div>
             </CardFooter>
           </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-16">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <UserX className="h-16 w-16 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-700">No Team Members Found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                There are currently no team members to display. Team members will appear here once they are added.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PublicMemberDirectory;