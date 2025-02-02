import React, { useContext, useEffect, useState } from "react";
import { AdminApi } from "../../../api";
import { useQuery, useQueryClient } from "react-query";
import ConfirmModal from "../../common/confirmModal";
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { adminLogoutThuck } from "@/redux/action/actions";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { SocketContext } from "@/context/socketContext";
import { AppDispatch } from "@/redux/store";
import { UserData } from "@/types/user";

interface UserTableProps {
  searchTerm: string;
}

const UserTable: React.FC<UserTableProps> = ({ searchTerm }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [state, setState] = useState<{
    id?: string;
    email?: string;
    index?: number;
    name?: string;
    isBlock?: boolean;
  }>({});

  const { data, isLoading } = useQuery("fetchUsers", AdminApi.fetchUsers, {
    refetchInterval: 30000, // Refresh every 30 seconds
  });
  
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { authSocket } = useContext(SocketContext);

  useEffect(() => {
    if (data instanceof AxiosError) {
      dispatch(adminLogoutThuck())
        .unwrap()
        .then(() => navigate("/admin/signin"));
    }
  }, [data]);

  const handleBlock = async () => {
    try {
      await AdminApi.blockUser(state.id as string);
      authSocket?.emit("block:user", { roomId: state.id });
      queryClient.setQueryData("fetchUsers", (users: any) => {
        return users.map((user: UserData, index: number) => {
          if (index === state.index) {
            return { ...user, isBlocked: !user.isBlocked };
          }
          return user;
        });
      });
      setOpen(false);
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };
  
  const filteredUsers = Array.isArray(data) ? data.filter((user: UserData) => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  ) : [];

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Desktop View */}
      <div className="hidden md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </td>
              </tr>
            ) : filteredUsers?.length ? (
              filteredUsers.map((user: UserData, index: number) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600">
                          {user.username[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(user.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isBlocked 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => {
                        setState({
                          id: user._id,
                          email: user.email,
                          index,
                          name: user.username,
                          isBlock: user.isBlocked,
                        });
                        setOpen(true);
                      }}
                      className={`px-4 py-2 rounded-md border ${
                        user.isBlocked 
                          ? 'border-green-600 text-green-600 hover:bg-green-50' 
                          : 'border-red-600 text-red-600 hover:bg-red-50'
                      } transition-colors`}
                    >
                      {user.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {filteredUsers?.map((user: UserData, index: number) => (
          <div key={user._id} className="border-b border-gray-200 p-4">
            <div className="flex items-center mb-3">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-lg font-medium text-indigo-600">
                  {user.username[0].toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">{user.username}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Phone:</span>
                <span className="text-sm text-gray-900">{user.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Joined:</span>
                <span className="text-sm text-gray-900">
                  {format(new Date(user.createdAt), "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Status:</span>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user.isBlocked 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user.isBlocked ? 'Blocked' : 'Active'}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => {
                  setState({
                    id: user._id,
                    email: user.email,
                    index,
                    name: user.username,
                    isBlock: user.isBlocked,
                  });
                  setOpen(true);
                }}
                className={`w-full px-4 py-2 rounded-md border ${
                  user.isBlocked 
                    ? 'border-green-600 text-green-600 hover:bg-green-50' 
                    : 'border-red-600 text-red-600 hover:bg-red-50'
                } transition-colors`}
              >
                {user.isBlocked ? 'Unblock' : 'Block'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {open && (
        <ConfirmModal
          handleClose={setOpen}
          handleSubmit={handleBlock}
          message={
            !state.isBlock
              ? `Are you sure you want to block ${state.name}?`
              : `Are you sure you want to unblock ${state.name}?`
          }
          title={state.isBlock ? "Unblock User" : "Block User"}
          open={open}
        />
      )}
    </div>
  );
};

export default UserTable;