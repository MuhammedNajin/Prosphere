import React from "react";
import Sidebar from "../Home/Sidebar";
import { FaEdit } from "react-icons/fa";

const Profile: React.FC = () => {
  return (
    <main>
      <header>
        <nav className="bg-slate-400 h-24"></nav>
      </header>

      <div className="h-screen">
        <div className="flex justify-center w-full mt-10">
          {/* <Sidebar /> */}
          <div className="flex flex-col justify-center  basis-2/3">
            <div className="w-full  bg-white border rounded ">
              <div className="w-full relative h-56">
                <img
                  src="https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  style={{ width: "100%", height: "100%" }}
                  className=""
                  alt=""
                />
                <div className="w-40 h-40 top-36 bg-slate-600 object-cover rounded-full absolute left-1/2 -translate-x-1/2">
                  <img
                    src="https://wallpapers.com/images/featured/cool-profile-picture-87h46gcobjl5e4xu.jpg"
                    className="rounded-full"
                    style={{ width: "100%", height: "100%" }}
                    alt=""
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <div className="mt-2 p-2">
                  <h1>Muhammed Najin N</h1>
                  <h2>Full stack developer</h2>
                  <h3>Kozhikode, kerala, india</h3>
                  <p>12 connections</p>
                  <div className="flex">
                    <p>Joined october 2023</p>
                    <p>contact info</p>
                  </div>
                  <div className="flex">
                    <button className="px-8 mr-2 py-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200">
                      Connect
                    </button>
                    <button className="px-8 py-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200">
                      Follow
                    </button>
                  </div>
                </div>
                <div className="flex flex-col justify-between p-2">
                  <div>
                    <div className="flex justify-end">
                      <FaEdit />
                    </div>
                    <div className="flex items-center">
                      <div className="h-14 w-14">
                        <img
                          src="data:image/png;base64,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"
                          alt=""
                        />
                      </div>
                      <div>
                        <h1>Broto</h1>
                      </div>
                    </div>
                  </div>
                  <div>
                    <button className="px-8 py-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200">
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full mt-3 bg-white p-5">
                 <ul className="flex justify-around">
                  {
                    ['Post', 'Followers', 'Following'].map((el) => {
                      return (
                        <li className="cursor-pointer"><span className="mr-2 cursor-pointer">0</span>{el}</li>
                      )
                    })
                  }
            
                 </ul>
            </div>

            <div className="mt-3">
            <ul className="flex justify-around">
                  {
                    ['About', 'Skills', 'Experience', 'Post'].map((el) => {
                      return (
                        <li className="cursor-pointer">{el}</li>
                      )
                    })
                  }
            
                 </ul>
                 <div className="w-full h-px bg-zinc-600 mt-2"></div>
            </div>
            <div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
