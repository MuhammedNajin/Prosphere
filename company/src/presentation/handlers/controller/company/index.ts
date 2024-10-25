import { createCompanyController } from "./createCompany.controller";
import { getCompanyController } from "./getCompany.controller";
import { updateCompanyProfileController } from "./updateCompnayProfile.controller"
 const companyController = (dependencies: any) => {
    console.log("company controller");
  
    return {
      createCompanyController: createCompanyController(dependencies),
      getCompanyController: getCompanyController(dependencies),
      updateCompanyProfileController: updateCompanyProfileController(dependencies),
    };
  };
  
  export { companyController };