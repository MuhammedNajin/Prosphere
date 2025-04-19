import { createCompanyController } from "./createCompany.controller";
import { getCompanyController } from "./getCompany.controller";
import { updateCompanyProfileController } from "./updateCompnayProfile.controller"
import { upadateCompanyLogoController } from './updateCompanyLogo.controller'
import { getFileController } from './getUploadedFile.controller'
import { getCompanyProfileController } from './getCompanyProfile.controller'
import { uploadCompanyVerificationController } from "./uploadCompanyVerificationDocs.controller";
import { generateCompanyAccessTokenController } from './generateCompanyToken.controller';
import { addEmployeeController } from './addEmployee.controller';
import { searchUserController  } from "./searchUser.controller";
import { getEmployeeController } from "./getEmployees.controller";
import { getFilesController } from "./getUploadedImages.controller";
 const companyController = (dependencies: any) => {
    console.log("company controller",dependencies );
  
    return {
      createCompanyController: createCompanyController(dependencies),
      getCompanyController: getCompanyController(dependencies),
      updateCompanyProfileController: updateCompanyProfileController(dependencies),
      upadateCompanyLogoController: upadateCompanyLogoController(dependencies),
      getFileController: getFileController(dependencies),
      getCompanyProfileController: getCompanyProfileController(dependencies),
      uploadCompanyVerificationController: uploadCompanyVerificationController(dependencies),
      generateCompanyAccessTokenController: generateCompanyAccessTokenController(dependencies),
      addEmployeeController: addEmployeeController(dependencies),
      searchUserController: searchUserController(dependencies),
      getEmployeeController: getEmployeeController(dependencies),
      getFilesController: getFilesController(dependencies),
    };
  };
  
  export { companyController };