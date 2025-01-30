import Header from "@/components/common/navBar/Header";
import JobListing from "@/components/job/JobListing.component";
import React from "react";

const JobListingPage: React.FC = () => {
    return (
        <div>
           <JobListing />
        </div>
    )
}

export default JobListingPage;