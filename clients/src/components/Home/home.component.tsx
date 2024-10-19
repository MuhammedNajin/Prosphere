
import Header from "../common/navBar/NavBar";
import StorySection from "./Story";
import Post from "./Post";
import Suggestions from "./Suggetions";
import Sidebar from "./Sidebar";

const JobPortal: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="flex p-4 space-x-4">
       <Sidebar />
        <main className="flex-grow space-y-4">
          <StorySection />
          <Post />
        </main>
        <Suggestions />
      </div>
    </div>
  );
};

export default JobPortal;