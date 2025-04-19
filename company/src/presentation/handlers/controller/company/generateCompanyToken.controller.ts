import { Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  ResponseUtil,
  StatusCode,
} from "@muhammednajinnprosphere/common";
import { generateCompanyAccessToken } from "@infra/libs/token";
import { CompanyStatus } from "@/shared/types/company";
import { winstonLogger } from "@/presentation/middlewares/winstonLogger";

export const generateCompanyAccessTokenController = (
  dependencies: Dependencies
) => {
  const {
    useCases: { getCompanyByIdUseCase },
    service: { grpcClient },
  } = dependencies;

  console.log("generate token con grps", grpcClient);

  const generateCompanyAccess = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      console.log(
        "company token ",
        JSON.parse(req.headers["x-user-data"] as string)
      );

      const { company, subscription } = await getCompanyByIdUseCase(
        dependencies
      ).execute(id as string);
      console.log("company", company);

      if (!company) {
        throw new NotFoundError();
      }

      if (company.status !== CompanyStatus.Verified) {
        throw new ForbiddenError(
          "Access denied. Company account is not verified. Please complete the verification process to proceed."
        );
      }


      const { owner, verified, status, _id, name } = company;

      const tokenPayload = {
        id: _id,
        name,
        owner,
        verified,
        status,
        role: "owner",
      };

      winstonLogger.info("token Payload ", { tokenPayload });

      const accessToken = generateCompanyAccessToken(tokenPayload);

      console.log("token", accessToken);

      res.cookie("companyAccessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 4 * 60 * 60 * 1000,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });

      const subscriptionData = {
        isSubscribed: subscription.isSubscribed,
        subscriptionStatus: subscription.status,
        subscriptionType: subscription.type,
        subscriptionPlan: subscription.plan,
        trailLimit: subscription.trailLimit,
        usageLimit: subscription.usageLimit,
        isTrail: !subscription.isSubscribed,
        startDate: subscription?.startDate ?? new Date(),
        endDate: subscription?.endDate ?? new Date(),
      };

      res
       .status(StatusCode.OK)
       .json(ResponseUtil.success(subscriptionData));

    } catch (error) {
      console.error("Error generating company access:", error);
      next(error);
    }
  };

  return generateCompanyAccess;
};
