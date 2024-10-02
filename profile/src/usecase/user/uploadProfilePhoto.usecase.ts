
export const uploadProfilePhotoUseCase = (dependencies: any) => {
  const {
    repository: { profileRepository },
    service: { s3Operation, resizeImage }
  } = dependencies;

  if (!profileRepository) {
    throw new Error("dependency required, missing dependency");
  }

  const execute = async ({ file, profile, email }) => {

    if(profile.profilePhoto) {
      await s3Operation.deleteImageFromBucket(profile.profileImageKey);
   }

      const fileBufferCode = await resizeImage(file.buffer);

      const { fileName, data } = await s3Operation.uploadImageToBucket(fileBufferCode, file.mimetype);

      console.log("fileName", fileName, "/n", "data", data);
   
      const imageUrl = await s3Operation.getImageUrlFromBucket(fileName);

      await profileRepository.uploadProfilePhoto({
        email,
        url: imageUrl,
        key: fileName,
      })

      return imageUrl
  }
  return {
    execute,
  };
};
