export const uploadResumeUseCase = (dependencies: any) => {
  const {
    repository: { profileRepository },
    service: { s3Operation, resizeImage },
  } = dependencies;

  if (!profileRepository) {
    throw new Error("dependency required, missing dependency");
  }

  const execute = async ({ file, id }) => {
    console.log(file, id, file.originalname);
  
    const bucketKey = `${Math.random()}${file.originalname}`;

    const data = await s3Operation.uploadImageToBucket(
      file.buffer,
      file.mimetype,
      bucketKey
    );

    console.log("fileName", bucketKey, "/n", "data", data);
    await profileRepository.setResume(id, bucketKey);
    return await s3Operation.getImageUrlFromBucket(bucketKey);
  };
  return {
    execute,
  };
};
