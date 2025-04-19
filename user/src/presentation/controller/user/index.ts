import { uploadProfilePhotoController } from "./uploadProfilePhoto.controller";
import { aboutController } from "./about.controller";
import { getProfileController } from "./getProfile.controller";
import { updateProfileController } from "./updateProfile.controller";
import { uploadResumeController } from "./uploadResume.controller";
import { getUploadedFileController } from "./getUploadedFile.controller";
import { getFilesController } from "./getUploadedFiles.controller";
import { deleteResumeController } from "./deleteResume.controller";
import { searchController } from "./search.contoller";
 const profileController = (dependencies: any) => {
    console.log("profile controller");
  
    return {

      uploadProfilePhotoController: uploadProfilePhotoController(dependencies),
      aboutController: aboutController(dependencies),
      getProfileController: getProfileController(dependencies),
      updateProfileController: updateProfileController(dependencies),
      uploadResumeController: uploadResumeController(dependencies),
      getUploadedFileController: getUploadedFileController(dependencies),
      getFilesController: getFilesController(dependencies),
      deleteResumeController: deleteResumeController(dependencies),
      searchController: searchController(dependencies),
    };
  };
  
  export { profileController };