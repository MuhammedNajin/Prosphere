import React, { useEffect } from "react";
import { AdminApi } from "../../../api";
import { useQuery, useQueryClient } from "react-query";

const UserTable: React.FC = () => { 
const { data } = useQuery('fetchUsers', AdminApi.fetchUsers, {

})
const queryClient = useQueryClient()
   console.log(data)
const handleBlock = (e) => {
   queryClient.setQueryData('fetchUsers', (user: any) => {
    const blocked = user[e.value.target].isBlocked
      return [...user, user[e.value.target].isBlocked = !blocked]
   })
}
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
              phone
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
            {
                data && data.length > 0 ? 
                data.map((el, index: number) => {
                   return (
                    <tr>
                    <td className="px-5 py-5 text-sm">{ el.username }</td>
                    <td className="px-5 py-5 text-sm">{ el.email }</td>
                    <td className="px-5 py-5 text-sm">{ el.phone }</td>
                    <td className="px-5 py-5 text-sm">{ el.createdAt }</td>
                    <td className="px-5 py-5 text-sm">
                      <button value={index} onClick={handleBlock} className="px-4 py-2 rounded-md border border-red-600 bg-white text-red-500 text-sm hover:shadow-[4px_4px_0px_0px_rgba(191,17,17)] transition duration-200">
                        Block
                      </button>
                    </td>
                  </tr>
                   )
                }) 
                : 
                <tr>
                    <td className="px-5 py-5 text-sm">not found</td>
                </tr>
            }
          {/* Repeat for other rows */}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
