
export const getProfileUseCase = (dependencies: any) => {
    const {
      repository: { profileRepository},
      service: { s3Operation }
    } = dependencies;
  
    if (!profileRepository) {
      throw new Error("dependency required, missing dependency");
    }
  
    const execute = async ({ email }) => {
       const profile =  await profileRepository.getProfile(email);
       let avatarUrl = await profileRepository.getCache(profile.profileImageKey)
       let coverUrl = await profileRepository.getCache(profile.coverImageKey)
       
       console.log("url", avatarUrl, coverUrl, profile.coverImageKey);

       if(!avatarUrl && profile.profileImageKey) {
        avatarUrl =  await s3Operation.getImageUrlFromBucket(profile.profileImageKey)
        await profileRepository.setCache(profile.profileImageKey, avatarUrl)
       }

       if(!coverUrl && profile.coverImageKey) {
        coverUrl = await s3Operation.getImageUrlFromBucket(profile.coverImageKey)
        await profileRepository.setCache(profile.coverImageKey, coverUrl)
       }

       profile.coverImageKey = coverUrl;
       profile.profileImageKey = avatarUrl;

       return profile;
    }
    return {
      execute,
    };
  };
  