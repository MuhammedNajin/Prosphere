import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const StartPosting = () => {

  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const url = user ? "/" : '/signup'
  return (
    <div className="bg-orange-600 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-white space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Start posting
              <br />
              jobs today
            </h2>
            <p className="text-orange-100">
              Start posting jobs for only $10.
            </p>
            <button 
             onClick={() => navigate(url)}
             className="bg-white text-orange-600 px-8 py-3 rounded-lg font-medium hover:bg-orange-50 transition-colors">
              { user ? "Get Started" : "Sign Up For Free"}
            </button>
          </div>

          <div className="relative">
            <div className="bg-white rounded-lg shadow-xl p-4 transform rotate-2 hover:rotate-0 transition-transform duration-300">

              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-600">Good morning, Marco</div>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-800">21,457</div>
                  <div className="flex space-x-4 mt-2">

                    <div className="w-8 h-16 bg-orange-200 rounded-t-lg"></div>
                    <div className="w-8 h-24 bg-orange-300 rounded-t-lg"></div>
                    <div className="w-8 h-20 bg-orange-400 rounded-t-lg"></div>
                    <div className="w-8 h-32 bg-orange-500 rounded-t-lg"></div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-semibold">Recent Applicants</div>
                    <div className="text-orange-600">15 Applicants</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="font-medium">Social Media Specialist</div>
                      <div className="text-sm text-gray-500">4 mins ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 w-1/3 h-24 bg-orange-500 transform -skew-y-6"></div>
    </div>
  );
};

export default StartPosting;