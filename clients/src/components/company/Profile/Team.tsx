import React from "react";
import {
  Users,
  Search,
  UserX
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AddMemberModal from "./AddMemberModal";

const PublicMemberDirectory = () => {
  const members = [
    {
      id: 1,
      firstName: "Sarah",
      lastName: "C.",
      role: "Senior Developer",
      avatar: "/api/placeholder/32/32",
    },
    {
      id: 2,
      firstName: "Michael",
      lastName: "W.",
      role: "Technical Lead",
      avatar: "/api/placeholder/32/32",
    },
  ];

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
          <AddMemberModal />
        </div>
      </div>

      {members.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <Card
              key={member.id}
              className="hover:shadow-lg transition-shadow duration-200 text-center"
            >
              <CardHeader className="pt-8 pb-4">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="text-xl">
                      {member.firstName[0]}
                      {member.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl font-bold">
                    {member.firstName} {member.lastName}
                  </CardTitle>
                  <CardDescription className="text-lg mt-2">
                    {member.role}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  className="mt-4 w-full bg-orange-700 text-white hover:bg-orange-800"
                >
                  View Profile
                </Button>
              </CardContent>
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