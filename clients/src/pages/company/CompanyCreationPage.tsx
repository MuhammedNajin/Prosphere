import React from "react";
import CompanyDetailsForm from "@/components/company/CompanyForm";
import Header from "@/components/common/navBar/Header";


const CompanyCreationPage: React.FC = () => {
   

    return (
        <div>
          <Header />  
         <CompanyDetailsForm />
        </div>
    )
}

export default CompanyCreationPage