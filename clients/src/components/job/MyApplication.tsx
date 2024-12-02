import { useMyApplications } from '@/hooks/useMyApplication';
import { Ellipsis, Filter, Menu, Search } from 'lucide-react';
import React, { useEffect } from 'react';
import { format } from 'date-fns'
const MyApplication = () => {
    const myApplication = useMyApplications();
  const tabs = [
    { name: 'All', count: 45, active: true },
    { name: 'In Review', count: 34 },
    { name: 'Interviewing', count: 18 },
    { name: 'Assessment', count: 5 },
    { name: 'Offered', count: 2 },
    { name: 'Hired', count: 1 },
  ];

  useEffect(() => {
     console.log("data", myApplication)
  },[myApplication])

  const applications = [
    {
      id: 1,
      company: { name: 'Nomad', logo: '/api/placeholder/40/40' },
      role: 'Social Media Assistant',
      dateApplied: '24 July 2021',
      status: { label: 'In Review', color: 'amber-400' }
    },
    {
      id: 2,
      company: { name: 'Udacity', logo: '/api/placeholder/40/40' },
      role: 'Social Media Assistant',
      dateApplied: '20 July 2021',
      status: { label: 'Shortlisted', color: 'emerald-300' }
    },
    {
      id: 3,
      company: { name: 'Packer', logo: '/api/placeholder/40/40' },
      role: 'Social Media Assistant',
      dateApplied: '16 July 2021',
      status: { label: 'Offered', color: 'indigo-600' }
    },
    {
      id: 4,
      company: { name: 'Divvy', logo: '/api/placeholder/40/40' },
      role: 'Social Media Assistant',
      dateApplied: '14 July 2021',
      status: { label: 'Interviewing', color: 'amber-400' }
    },
    {
      id: 5,
      company: { name: 'DigitalOcean', logo: '/api/placeholder/40/40' },
      role: 'Social Media Assistant',
      dateApplied: '10 July 2021',
      status: { label: 'Unsuitable', color: 'red-400' }
    }
  ];

  return (
    <main className="min-h-screen bg-white">
      <section className="container mx-auto px-4 py-8">
        {/* Tabs Navigation */}
        <div className="w-full overflow-x-auto">
          <nav className="flex min-w-max gap-4 border-b pb-2 mb-6">
            { tabs.map((tab, index) => (
              <button
                key={index}
                className={`px-4 py-2 whitespace-nowrap ${
                  tab.active ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'
                }`}
              >
                {tab.name} <span className="text-slate-500">({tab.count})</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Header and Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold">Applications History</h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Search />
              <span>Search</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Filter />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Applications Table */}
        <div className="w-full overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-gray-500 text-lg">
                <th className="p-4 font-medium">#</th>
                <th className="p-4 font-medium">Company Name</th>
                <th className="p-4 font-medium">Roles</th>
                <th className="p-4 font-medium">Date Applied</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {myApplication && myApplication.applications.map((app, index) => (
                <tr 
                  key={app._id}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} capitalize text-base`}
                >
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={app.company || "/company.png"}
                        alt={`${app.companyId.name} logo`}
                        className="w-10 h-10 rounded-full"
                      />
                      <span className=''>{app.companyId.name}</span>
                    </div>
                  </td>
                  <td className="p-4">{app.jobId.jobTitle}</td>
                  <td className="p-4">{format(app.appliedAt, 'PPP')}</td>
                  <td className="p-4">
                    <span 
                      className={`px-3 py-1 rounded-full  font-medium bg-${app.status.color}/10 text-${app.status.color}`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Ellipsis className='rotate-90' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </section>
    </main>
  );
};

export default MyApplication;