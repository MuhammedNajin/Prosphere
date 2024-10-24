
export const uploadProfilePhotoUseCase = (dependencies: any) => {
  const {
    repository: { profileRepository, setCache },
    service: { s3Operation, resizeImage }
  } = dependencies;

  if (!profileRepository) {
    throw new Error("dependency required, missing dependency");
  }

  const execute = async ({ file, profile, email, key }) => {

    if(profile[key]) {
      await s3Operation.deleteImageFromBucket(profile[key]);
   }

      const fileBufferCode = await resizeImage(file.buffer);

      const { fileName, data } = await s3Operation.uploadImageToBucket(fileBufferCode, file.mimetype);

      console.log("fileName", fileName, "/n", "data", data);
   
      const imageUrl = await s3Operation.getImageUrlFromBucket(fileName);
       await profileRepository.setCache(fileName, imageUrl);
      const query = {
          [key]: fileName,
      }
      console.log("key", query)
      const result = await profileRepository.uploadFile({
        email,
        query,
      })
      console.log("result", result);
      
      return imageUrl
  }
  return {
    execute,
  };
};
