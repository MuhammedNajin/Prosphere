export const uploadResumeUseCase = (dependencies: any) => {
  const {
    repository: { profileRepository },
    service: { s3Operation, resizeImage },
  } = dependencies;

  if (!profileRepository) {
    throw new Error("dependency required, missing dependency");
  }

  const execute = async ({ file, profile, email }) => {
    console.log(file, email, file.originalname);
    if (profile.resumeKey) {
      await s3Operation.deleteImageFromBucket(profile.resumeKey);
    }

    const bucketKey = `${email}${file.originalname}`;

    const data = await s3Operation.uploadImageToBucket(
      file.buffer,
      file.mimetype,
      bucketKey
    );

    console.log("fileName", bucketKey, "/n", "data", data);

    return await s3Operation.getImageUrlFromBucket(bucketKey);
  };
  return {
    execute,
  };
};
