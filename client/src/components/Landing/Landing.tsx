import React from "react";
import JobSearchLanding from "./Header";
import StartPosting from "./Banner";
import LatestJobs from "./JobListing";
import Footer from "../common/Footer/Footer";


const Landing: React.FC = () => {
  return (
    <div>
      <JobSearchLanding />

      <StartPosting />

      <LatestJobs />

      <Footer />
    </div>
  );
};

export default Landing;
