import React, { useState, useCallback, useEffect } from "react";
import { Plus, Search, UserPlus, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define interfaces for type safety
interface PlatformUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  department: string;
}

// Sample data - In a real app, this would come from an API
const platformUsers: PlatformUser[] = [
  {
    id: "p1",
    firstName: "Emma",
    lastName: "Singh",
    email: "emma.singh@platform.com",
    avatar: "/api/placeholder/32/32",
    department: "Engineering",
  },
  {
    id: "p2",
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@platform.com",
    avatar: "/api/placeholder/32/32",
    department: "Product",
  },
];

// Utility function for debouncing search
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const AddMemberModal = () => {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<PlatformUser[]>(platformUsers);
  const [isSearching, setIsSearching] = useState(false);

  // Create debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setIsSearching(true);
      
      const results = platformUsers.filter(
        (user) =>
          user.firstName.toLowerCase().includes(query.toLowerCase()) ||
          user.lastName.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(results);
      setIsSearching(false);
    }, 300),
    []
  );

  // Effect to handle search term changes
  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      setSearchResults(platformUsers);
    }
  }, [searchTerm, debouncedSearch]);

  // Handle platform user selection
  const handlePlatformUserSelect = (user: PlatformUser) => {
    console.log('Selected user:', user);
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          // Clean up when modal closes
          setSearchTerm("");
          setSearchResults(platformUsers);
        }
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add New Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <UserPlus className="h-6 w-6" />
            Add Platform Member
          </DialogTitle>
          <DialogDescription>
            Search and select an existing platform user to add as a member.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              className="pl-10"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="min-h-[200px]">
            {isSearching ? (
              <div className="flex items-center justify-center h-[200px] text-gray-500">
                <div className="animate-spin mr-2">
                  <Search className="h-4 w-4" />
                </div>
                Searching...
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {searchResults.map((user) => (
                  <Card
                    key={user.id}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handlePlatformUserSelect(user)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.firstName[0]}
                            {user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">
                            {user.firstName} {user.lastName}
                          </h4>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Results Found</AlertTitle>
                <AlertDescription>
                  Try searching with a different term.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberModal;