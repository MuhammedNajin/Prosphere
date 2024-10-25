import express, { NextFunction, Request, Response } from "express";


/**
 * Controller for handling company profile updates
 * 
 * @param {Dependencies} dependencies - Injected dependencies
 * @returns {Function} Express middleware function
 */

export const updateCompanyProfileController = (dependencies: any) => {
  console.log("update profile");

  const {
    useCases: { updateProfileUseCase },
  } = dependencies;

 /**
   * Updates a company profile
   * 
   * @param {UpdateCompanyRequest} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next middleware function
   */

  const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("body", req.body, req.query);
      const { _id } = req.params;
      const { array } = req.query;
      const isArray = array === 'true'
      const updatedProfile = await updateProfileUseCase(dependencies).execute({
         _id,
         body: req.body,
         isArray
      })
      console.log("profile update", updatedProfile);

      return res.status(200).json({
        success: true,
        data: updatedProfile,
        message: 'Company profile updated successfully'
      });

    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  return createUser;
};
