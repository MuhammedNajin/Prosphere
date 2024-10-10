import express, { NextFunction, Request, Response } from "express";


export const aboutController = (dependencies: any) => {
  console.log("signup");
  
  const {
    useCases: { aboutUseCase },
  } = dependencies;
  
  
  const aboutMe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(req.body);
      
      const { description, email } = req.body;

      const user = await aboutUseCase(dependencies).execute({
        description,
        email,
      })

      if(!user) {
        throw new Error("sonme")
      }

      res.status(200).json(user);
        
    } catch (error) {

        console.log(error);
        
    }
  }
  return aboutMe;
};
