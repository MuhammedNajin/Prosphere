import { createCompanyController } from "./createCompany.controller";
import { getCompanyController } from "./getCompany.controller";
import { updateCompanyProfileController } from "./updateCompnayProfile.controller"
import { upadateCompanyLogoController } from './updateCompanyLogo.controller'
import { getFileController } from './getUploadedFile'
import { getCompanyProfileController } from './getCompanyProfile.controller'
 const companyController = (dependencies: any) => {
    console.log("company controller");
  
    return {
      createCompanyController: createCompanyController(dependencies),
      getCompanyController: getCompanyController(dependencies),
      updateCompanyProfileController: updateCompanyProfileController(dependencies),
      upadateCompanyLogoController: upadateCompanyLogoController(dependencies),
      getFileController: getFileController(dependencies),
      getCompanyProfileController: getCompanyProfileController(dependencies),
    };
  };
  
  export { companyController };