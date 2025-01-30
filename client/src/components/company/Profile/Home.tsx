import { CompanyApi, JobApi } from "@/api";
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Linkedin,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Plus,
  Repeat2,
  Send,
  ThumbsUp,
  UserX,
} from "lucide-react";
import React from "react";
import { FaRegComment } from "react-icons/fa";
import { useQuery } from "react-query";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import JobUpdates from "../Dashboard/JobCard";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Home: React.FC = () => {
  const { companyProfile } = useOutletContext();

  const navigate = useNavigate()
  const { id } = useParams()
  const { data } = useQuery({
    queryKey: ['people'],
     queryFn: () => CompanyApi.getEmployees()

  })

  const getInitial = (username: string) => {
    return username ? username[0].toUpperCase() : "U";
  };

  
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "";
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
  };

  return (
    <div>
      <div className=" p-6 bg-white rounded border-b">
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">About</h2>
            </div>
           { companyProfile?.description ? (
              <p className="text-gray-600 mb-6">
              { companyProfile?.description }
             </p>
           ): (
            <div className="p-5 flex basis-full justify-between bg-[#f8f9fa] border my-4 rounded-lg items-center">
                <div>
                  <h1 className="text-lg font-clash font-bold">Description</h1>
                  <p className="text-sm">
                    Add a description about your company
                  </p>
                </div>
              </div>
           )
           }
          </div>
        </div>
      </div>

      <div className=" px-8 bg-white  rounded py-4">
       
      </div>


      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold ">Team</h2>
        </div>
        {data && data?.team.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.team?.map(({ userId }) => (
             <Card className="w-full max-w-sm transform transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white dark:bg-zinc-900">
             <CardHeader className="pt-6 pb-4">
               <div className="relative flex flex-col items-center">
            
                 <div className="absolute top-0 right-0">
                   <div className="h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-zinc-900" />
                 </div>
                 
                 <div className="p-1 rounded-full bg-gradient-to-r from-orange-400 to-orange-600">
                   <Avatar className="h-24 w-24 border-4 border-white dark:border-zinc-900">
                     <AvatarImage src={userId.profilePhoto} alt={userId.username} />
                     <AvatarFallback className="text-2xl font-bold bg-orange-100 text-orange-700">
                       {getInitial(userId.username)}
                     </AvatarFallback>
                   </Avatar>
                 </div>

                 <div className="mt-4 text-center">
                   <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                     {userId.username}
                   </h3>
                   {userId.about && (
                     <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                       {userId.about}
                     </p>
                   )}
                 </div>
               </div>
             </CardHeader>
       
             <CardContent className="pb-4">
               <div className="space-y-3">
                 <div className="flex items-center space-x-3 text-sm text-zinc-600 dark:text-zinc-300">
                   <Mail className="h-4 w-4 text-orange-600" />
                   <span className="truncate">{userId.email}</span>
                 </div>
                 <div className="flex items-center space-x-3 text-sm text-zinc-600 dark:text-zinc-300">
                   <Phone className="h-4 w-4 text-orange-600" />
                   <span>{formatPhoneNumber(userId.phone)}</span>
                 </div>
                 <div className="flex items-center space-x-3 text-sm text-zinc-600 dark:text-zinc-300">
                   <Briefcase className="h-4 w-4 text-orange-600" />
                   <span>{userId.jobRole}</span>
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
        {
           data && data?.team?.length > 3 && (
            <button
            onClick={() => navigate(`/company/profile/${id}/team`)}
            className="w-full mt-4 py-2 text-orange-600 font-semibold hover:bg-gray-100 rounded">
             View all members →
           </button>
           )
        }
      </div>

      <JobUpdates />
    </div>
  );
};

export default Home;
