
export const getUploadedFileUseCase = (dependencies: any) => {
    const {
      service: { s3Operation }
    } = dependencies;
  
    if (!s3Operation) {
      throw new Error("dependency required, missing dependency");
    }
  
    const execute = async (key: string) => {
      try {
        return await s3Operation.getImageUrlFromBucket(key);
      } catch (error) {
        console.log(error)
        throw error
      }
    }

    return {
      execute,
    };
  };
  