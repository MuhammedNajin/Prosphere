import { uploadProfilePhotoController } from "./uploadProfilePhoto.controller";
import { aboutController } from "./about.controller";
import { getProfileController } from "./getProfile.controller";
import { updateProfileController } from "./updateProfile.controller";


 const profileController = (dependencies: any) => {
    console.log("profile controller");
  
    return {
      uploadProfilePhotoController: uploadProfilePhotoController(dependencies),
      aboutController: aboutController(dependencies),
      getProfileController: getProfileController(dependencies),
      updateProfileController: updateProfileController(dependencies),
    };
  };
  
  export { profileController };