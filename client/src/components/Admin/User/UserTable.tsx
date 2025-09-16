import React, { useContext, useEffect, useState, useCallback } from "react";
import { useQuery, useQueryClient } from "react-query";
import ConfirmModal from "../../common/confirmModal";
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { adminLogoutThuck } from "@/redux/action/actions";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { SocketContext } from "@/context/socketContext";
import { AppDispatch } from "@/redux/store";
import { IUser } from "@/types/user";
import { AdminApi } from "@/api/admin.api";

interface UserTableProps {
  searchTerm: string;
}

const UserTable: React.FC<UserTableProps> = ({ searchTerm }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [state, setState] = useState<{
    id?: string;
    email?: string;
    index?: number;
    name?: string;
    isBlock?: boolean;
  }>({});

  // Debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, error } = useQuery(
    ["fetchUsers", currentPage, pageSize, debouncedSearchTerm],
    () => AdminApi.fetchUsers({
      page: currentPage,
      limit: pageSize,
      search: debouncedSearchTerm
    }),
    {
      refetchInterval: 30000, // Refresh every 30 seconds
      keepPreviousData: true, // Keep previous data while fetching new data
    }
  );
  
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { authSocket } = useContext(SocketContext);

  useEffect(() => {
    console.log("data", data);
    if (error instanceof AxiosError) {
      dispatch(adminLogoutThuck())
        .unwrap()
        .then(() => navigate("/admin/signin"));
    }
  }, [error, dispatch, navigate]);

  const handleBlock = async () => {
    try {
      await AdminApi.blockUser(state.id as string);
      authSocket?.emit("block:user", { roomId: state.id });
      
      // Update the cache to reflect the blocked status
      queryClient.setQueryData(
        ["fetchUsers", currentPage, pageSize, debouncedSearchTerm],
        (oldData: any) => {
          if (!oldData) return oldData;
          
          const updatedUsers = oldData.users.map((user: IUser, index: number) => {
            if (index === state.index) {
              return { ...user, isBlocked: !user.isBlocked };
            }
            return user;
          });
          
          return {
            ...oldData,
            users: updatedUsers
          };
        }
      );
      
      setOpen(false);
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  // Pagination handlers
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  // Pagination component
  const Pagination = () => {
    if (!data || data.totalPages <= 1) return null;

    const { currentPage: current, totalPages, total } = data;
    const startItem = (current - 1) * pageSize + 1;
    const endItem = Math.min(current * pageSize, total);

    // Generate page numbers to show
    const getPageNumbers = () => {
      const pages = [];
      const maxPagesToShow = 5;
      
      if (totalPages <= maxPagesToShow) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (current <= 3) {
          for (let i = 1; i <= 4; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        } else if (current >= totalPages - 2) {
          pages.push(1);
          pages.push('...');
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = current - 1; i <= current + 1; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        }
      }
      
      return pages;
    };

    return (
      <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(current - 1)}
              disabled={current === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(current + 1)}
              disabled={current === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startItem}</span> to{" "}
                <span className="font-medium">{endItem}</span> of{" "}
                <span className="font-medium">{total}</span> results
              </p>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="ml-2 border border-gray-300 rounded-md text-sm px-2 py-1"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => handlePageChange(current - 1)}
                  disabled={current === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ←
                </button>
                {getPageNumbers().map((page, index) => (
                  <React.Fragment key={index}>
                    {page === '...' ? (
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                    ) : (
                      <button
                        onClick={() => handlePageChange(page as number)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          current === page
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    )}
                  </React.Fragment>
                ))}
                <button
                  onClick={() => handlePageChange(current + 1)}
                  disabled={current === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  →
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const users = data?.users || [];

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
            ) : users?.length ? (
              users.map((user: IUser, index: number) => (
                <tr key={user.id} className="hover:bg-gray-50">
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
                          id: user.id,
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
        {users?.map((user: IUser, index: number) => (
          <div key={user.id} className="border-b border-gray-200 p-4">
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
                    id: user.id,
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
        
        {isLoading && (
          <div className="p-4 text-center">
            <div className="flex justify-center">
              <div className="h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        )}
        
        {!isLoading && users?.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No users found
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination />

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