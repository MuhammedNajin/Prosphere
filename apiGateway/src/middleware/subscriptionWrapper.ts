import { NextFunction, Request, Response } from "express";
import grpcPaymentClient from "../grpc/grpcPaymentClient";
import { customLogger } from "../logger/morgan";
import { Feature_Limit, URL, UsageMetrics } from "../type/enums";
import { ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";


export const subscriptionWrapper = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.currentCompany?.id;
    const companyId = id ? id : req.body.companyId;

    customLogger.debug("company Wrapper", { id, companyId });
    const result = grpcPaymentClient.isSubscribed(companyId);
    const url = req.url;
    

    if (result?.subscription) {
      const subscription = result?.subscription;
      const featureLimit = subscription?.planSnapshot?.featureLimit;
      const usage_stats = subscription.usageStats;
      if (url.includes(URL.JobPost)) {
        if (
          featureLimit[Feature_Limit.Job_Post_Limit] >
          usage_stats[UsageMetrics.JobPostsUsed]
        ) {
          next();
        } else {
          return res
            .status(StatusCode.PAYMENT_REQUIRED)
            .json(
              ResponseUtil.error(
                "Your Job posting limit had been exceeded, renew your plan"
              )
            );
        }
      }
    } else if (result?.company) {
      const trail_Limit = result?.usageStats;
      const trail_usage = result?.trailLimit;
      if (
        trail_Limit[UsageMetrics.JobPostsUsed] <
        trail_usage[UsageMetrics.JobPostsUsed]
      ) {
        next()
      } else {
        return res
        .status(StatusCode.BAD_REQUEST)
        .json(ResponseUtil.error("Trail limit exceeded"));
      }
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
