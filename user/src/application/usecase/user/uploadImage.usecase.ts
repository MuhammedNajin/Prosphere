
export const uploadProfilePhotoUseCase = (dependencies: any) => {
  const {
    repository: { profileRepository, setCache },
    service: { s3Operation, resizeImage }
  } = dependencies;

  if (!profileRepository) {
    throw new Error("dependency required, missing dependency");
  }

  const execute = async ({ file, id,  key }) => {

      const fileBufferCode = await resizeImage(file.buffer);
     const bucketKey = `${file.originalname}${Math.random()}`
      const data = await s3Operation.uploadImageToBucket(fileBufferCode, file.mimetype, bucketKey);

      console.log("bucketKey", bucketKey, "/n", "data", data);
   
      const imageUrl = await s3Operation.getImageUrlFromBucket(bucketKey);
      const query = {
          [key]: bucketKey,
      }

      console.log("key", query)
      const result = await profileRepository.uploadFile({
        id,
        query,
      })
      console.log("result", result);
      
      return { bucketKey, imageUrl }
  }
  return {
    execute,
  };
};
