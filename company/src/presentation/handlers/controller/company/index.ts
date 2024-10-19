import { createCompanyController } from "./createCompany.controller";
import { getCompanyController } from "./getCompany.controller";
 const companyController = (dependencies: any) => {
    console.log("company controller");
  
    return {
      createCompanyController: createCompanyController(dependencies),
      getCompanyController: getCompanyController(dependencies),
    };
  };
  
  export { companyController };