import React from "react";
import CompanyComponent from "@/components/company/Mycompany.component";
import Header from "@/components/common/navBar/Header";
import Sidebar from "@/components/Home/Sidebar";


const CompanyPage: React.FC = () => {

    return (
       <div>
           <Header />
           <div className="flex">
           <Sidebar />
           <CompanyComponent />
           </div>
       </div>
    )
}

export default CompanyPage;