import React,{ useEffect, useState } from "react";
import developerRoles from "../../data/Jobrole";
import { useDispatch } from "react-redux";
import { googleAuthThunk } from "../../redux";
import { useLocation, useNavigate } from "react-router-dom";


const Form: React.FC = () => {
    const [jobRole, setJobRole] = useState("");
    const [phone, setPhone] = useState("");
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    
    useEffect(() => {
       console.log(location);
       
    }, [])

    const handleGoogle = async () => {
        console.log("handle", jobRole, phone);
        const { email } = location.state
        dispatch(googleAuthThunk({phone, jobRole, email}))
        .unwrap()
        .then(() => {
            navigate('/')
        })
    }

  return (
    <div className="container min-h-screen flex items-center justify-center">
  <div className="w-full max-w-md p-10 rounded-lg ">
    <div className="flex justify-between mb-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Google Authentication</h2>
        <p className="text-gray-600">Enter your details</p>
      </div>
    </div>
    <form action="">
      <div className="mb-4">
        <label
          htmlFor="jobRole"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Phone
        </label>
        <input
        onChange={(e) => setPhone(e.target.value)}
          type="text"
          id="jobRole"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Software Developer"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="companyName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Job Role
        </label>
        <select name="" id=""
         onChange={(e) => setJobRole(e.target.value)} 
         className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
            {
                developerRoles && developerRoles.map((job) => {
                    return (
                        <option value={job}>{job}</option>
                    )
                })
            }
           
        </select>
        {/* <input
         onChange={(e) => set(e.target.value)}
          type="text"
          id="companyName"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Google"
        /> */}
      </div>
      {/* <div className="mb-4">
        <label
          htmlFor="companyName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Company name
        </label>
        <input
          type="text"
          id="companyName"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Google"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="companyName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Location
        </label>
        <input
          type="text"
          id="companyName"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Google"
        />
      </div> */}
      <button
        type="button"
        onClick={handleGoogle}
        className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-300"
      >
        Next
      </button>
    </form>
  </div>
</div>

  );
};

export default Form;
