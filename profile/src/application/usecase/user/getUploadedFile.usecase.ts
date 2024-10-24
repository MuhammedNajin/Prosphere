
export const getUploadedFileUseCase = (dependencies: any) => {
    const {
      service: { s3Operation }
    } = dependencies;
  
    if (!s3Operation) {
      throw new Error("dependency required, missing dependency");
    }
  
    const execute = async (key: string) => {
        return await s3Operation.getImageUrlFromBucket(key);
    }

    return {
      execute,
    };
  };
  