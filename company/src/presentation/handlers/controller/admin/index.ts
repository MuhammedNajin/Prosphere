import { getCompaniesController } from "./getCompanies.controller";
import { getCompanyController } from "./getCompany.controller";
import { changeCompanyStatusController } from "./changeCompanyStatus.controller";
import { getVerificatonDocsController } from "./getVerificationDocs.controller";
 const adminController = (dependencies: any) => {
    console.log("admin controller");
  
    return {
       getCompaniesController: getCompaniesController(dependencies),
       getCompanyController: getCompanyController(dependencies),
       changeCompanyStatusController: changeCompanyStatusController(dependencies),
       getVerificatonDocsController: getVerificatonDocsController(dependencies)
    };
  };
  
  export { adminController };