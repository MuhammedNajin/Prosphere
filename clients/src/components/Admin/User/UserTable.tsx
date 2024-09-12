import React, { useEffect, useState } from "react";
import { AdminApi } from "../../../api";
import { useQuery, useQueryClient } from "react-query";
import ConfirmModal from "../../common/confirmModal";
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { adminLogoutThuck } from "../../../redux";
import { useNavigate } from "react-router-dom";

const UserTable: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [state, setState] = useState<{ email?: string; index?: number, name?: string, isBlock?: boolean }>({});
  const { data, error, isFetched, isFetching } = useQuery("fetchUsers", AdminApi.fetchUsers, {});
  const queryClient = useQueryClient();
  const dispatch = useDispatch()
  const navigate = useNavigate();

  useEffect(() => {
    if(data instanceof AxiosError) {
      dispatch(adminLogoutThuck())
        .unwrap()
        .then(() => {
          navigate('/admin/login');
        })
    }
  }, [data])

  const handleBlock = async (e) => {
    const response = await AdminApi.blockUser(state.email as string);
    queryClient.setQueryData("fetchUsers", (users: any) => {
      return users.map((user, index) => {
        if (index === state.index) {
          return { ...user, isBlocked: !user.isBlocked };
        }
        return user;
      })
    });
    setOpen(!state);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Desktop view */}
      <div className="hidden md:block">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((el, index: number) => (
                <tr key={index}>
                  <td className="px-5 py-5 text-sm">{el.username}</td>
                  <td className="px-5 py-5 text-sm">{el.email}</td>
                  <td className="px-5 py-5 text-sm">{el.phone}</td>
                  <td className="px-5 py-5 text-sm">{el.createdAt}</td>
                  <td className="px-5 py-5 text-sm">
                    <button
                      onClick={() => {
                        setState({ ...state, email: el.email, index, name: el.username, isBlock: el.isBlocked });
                        setOpen(!open);
                      }}
                      className="px-4 py-2 rounded-md border border-red-600 bg-white text-red-500 text-sm hover:shadow-[4px_4px_0px_0px_rgba(191,17,17)] transition duration-200"
                    >
                      {el.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-5 py-5 text-sm" colSpan={5}>No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        {data && data.length > 0 ? (
          data.map((el, index: number) => (
            <div key={index} className="border-b p-4">
              <p><strong>Name:</strong> {el.username}</p>
              <p><strong>Email:</strong> {el.email}</p>
              <p><strong>Phone:</strong> {el.phone}</p>
              <p><strong>Date:</strong> {el.createdAt}</p>
              <button
                onClick={() => {
                  setState({ ...state, email: el.email, index, name: el.username, isBlock: el.isBlocked });
                  setOpen(!open);
                }}
                className="mt-2 px-4 py-2 rounded-md border border-red-600 bg-white text-red-500 text-sm hover:shadow-[4px_4px_0px_0px_rgba(191,17,17)] transition duration-200"
              >
                {el.isBlocked ? "Unblock" : "Block"}
              </button>
            </div>
          ))
        ) : (
          <p className="p-4">No users found</p>
        )}
      </div>

      {open && (
        <ConfirmModal
          handleClose={setOpen}
          handleSubmit={handleBlock}
          message={!state.isBlock ? `Are you sure to block ${state.name}` : `Are you sure to unblock ${state.name}`}
          title="Block the user"
          open={open}
        />
      )}
    </div>
  );
};

export default UserTable;