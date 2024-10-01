import { createCompanyController } from "./createCompany.controller";
 const companyController = (dependencies: any) => {
    console.log("company controller");
  
    return {
      createCompanyController: createCompanyController(dependencies),
    };
  };
  
  export { companyController };