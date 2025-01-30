import React from 'react'
import {  useQuery } from 'react-query';
import { AdminApi } from '@/api';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const CompanyVerificationRequest: React.FC = () => {
  const navigate = useNavigate()
  const { data } = useQuery({
    queryKey: ['adminCompanyVerification'],
    queryFn: () => AdminApi.verificationRequest()
  })
  return (
    <div className='flex flex-1 p-8'>
       <div className="bg-white shadow-md rounded-lg overflow-hidden flex-1">
    
      <div className="">
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
            {data?.data && data.data.length > 0 ? (
              data.data?.map((el: any, index: number) => (
                <tr key={index}>
                  <td className="px-5 py-5 text-sm">{el.name}</td>
                  <td className="px-5 py-5 text-sm">{el.email}</td>
                  <td className="px-5 py-5 text-sm">{el.phone}</td>
                  <td className="px-5 py-5 text-sm">{format(el.createdAt, 'PPP')}</td>
                  <td className="px-5 py-5 text-sm">
                    <button
                      onClick={() => {
                         navigate(`/admin/company/verification/details/${el._id}`)
                      }}
                      className="px-4 py-2 rounded-md border border-red-600 bg-white text-red-500 text-sm hover:shadow-[4px_4px_0px_0px_rgba(191,17,17)] transition duration-200"
                    >
                     Verify
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
      
    </div>
    </div>
  )
}

export default CompanyVerificationRequest
