import React, { useState, useCallback, useEffect } from "react";
import { Plus, Search, UserPlus, AlertCircle, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CompanyApi } from "@/api";
import { useMutation } from "react-query";
import { Spinner } from "@/components/common/spinner/Loader";
import { useCurrentCompany } from "@/hooks/useSelectedCompany";
import { IUser } from "@/types/user";

/**
 * Creates a debounced version of a function that delays execution until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 * @param func The function to debounce
 * @param wait The number of milliseconds to delay
 */

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
interface AddMemberProps {
  onSuccess: (user: IUser) => void;
}

const AddMemberModal: React.FC<AddMemberProps> = ({ onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<IUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const company = useCurrentCompany();
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      setIsSearching(true);
      try {
        const response = await CompanyApi.searchUsers(query);
        setSearchResults(response);
      } catch (error) {
        console.error("Error searching users:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
    }
  }, [searchTerm, debouncedSearch]);

  const handlePlatformUserSelect = (user: IUser) => {
    setSelectedUser(user);
  };

  const addMemberMutation = useMutation({
    mutationFn: CompanyApi.addEmployeeToCompany,
    onSuccess: (data) => {
      console.log("success", data);
      onSuccess(data.data);
      setIsOpen(false);
    },
    onError: (err) => {
      console.log("errror from addMemberMutation", err);
    },
  });

  const handleAddMember = async () => {
    if (selectedUser) {
      try {
        console.log("Adding selected user:", selectedUser);
        addMemberMutation.mutate({
          companyId: company.id, // or however you get the current company ID
          userId: selectedUser.id,
        });
      } catch (error) {
        console.error("Error adding member:", error);
      }
    }
  };

  const resetModal = () => {
    setSearchTerm("");
    setSelectedUser(null);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetModal();
        }
        setIsOpen(open);
      }}
    >
      {company && (
        <DialogTrigger asChild>
          <Button className="bg-orange-600 hover:bg-orange-700">
            <Plus className="h-4 w-4 mr-2" />
            Add New Member
          </Button>
        </DialogTrigger>
      )}
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
                    className={`cursor-pointer transition-colors ${
                      selectedUser?.id === user.id
                        ? "bg-orange-50 border-orange-200"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => handlePlatformUserSelect(user)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.profileImageKey} />
                          <AvatarFallback>
                            <img src="/profileIcon.png" alt="Profile" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">{user?.username}</h4>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                        {selectedUser?.id === user.id && (
                          <Check className="h-5 w-5 text-orange-600" />
                        )}
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

        <DialogFooter>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-orange-600 hover:bg-orange-700"
              disabled={!selectedUser}
              onClick={handleAddMember}
            >
              {addMemberMutation.isLoading ? (
                <Spinner size={20} color="#ffffff" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberModal;
