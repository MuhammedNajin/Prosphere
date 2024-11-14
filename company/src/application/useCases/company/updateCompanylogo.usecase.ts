
export const updateCompanyLogoUseCase = (dependencies: any) => {
    const {
      repository: { companyRepository },
      service: { s3Operation },
    } = dependencies;
  console.log("companyRepository", dependencies.repository);
  
    if (!companyRepository) {
      throw new Error("dependency required, missing dependency");
    }
  
    const execute = async ({ file, id }) => {
      console.log(file, id, file.originalname);
    
      const bucketKey = `${file.originalname}${Math.random()}`;
  
      const data = await s3Operation.uploadImageToBucket(
        file.buffer,
        file.mimetype,
        bucketKey
      );
  
      console.log("fileName", bucketKey, "/n", "data", data);
      await companyRepository.updateCompany(id, { logo: bucketKey });
      return await s3Operation.getImageUrlFromBucket(bucketKey);
    };
    return {
      execute,
    };
  };
  