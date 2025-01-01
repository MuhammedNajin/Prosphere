export const deleteFileUseCase = (dependencies: any) => {
  const {
    repository: { profileRepository },
    service: { s3Operation },
  } = dependencies;

  if (!profileRepository) {
    throw new Error("dependency required, missing dependency");
  }

  const execute = async (key: string) => {
    return await s3Operation.deleteImageFromBucket(key);
  };

  return {
    execute,
  };
};
