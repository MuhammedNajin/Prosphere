import express, { NextFunction, Request, Response } from "express";


export const getProfileController = (dependencies: any) => {
  console.log("signup");
  
  const {
    useCases: { getProfileUseCase },
   
  } = dependencies;
  
  
  const getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      
        const { email } = req.params;
        console.log(email);

        const profile = await getProfileUseCase(dependencies).execute({
            email
        })
        
        if(!profile) {
            throw new Error("not found error");
        }

        res.status(200).json(profile);
    } catch (error) {

        console.log(error);
        
    }
  }
  return getProfile;
};
