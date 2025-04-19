import { ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import express, { NextFunction, Request, Response } from "express";

export const uploadProfilePhotoController = (dependencies: any) => {
  console.log("signup", dependencies);

  const {
    useCases: {
      getProfileUseCase,
      uploadProfilePhotoUseCase,
      deleteFileUseCase,
    },
    messageBroker: { ProfileUpdateProducer, kafka },
  } = dependencies;

  if (!ProfileUpdateProducer || !kafka) {
    throw new Error("argument missing at uploadProfilePhoto controller ");
  }

  const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("body", req.query);
      console.log("files", req.file);
      const { key, exisitingKey } = req.query;

      const { id } = JSON.parse(req.headers["x-user-data"] as string);

      if (exisitingKey) {
        await deleteFileUseCase(dependencies).execute(exisitingKey);
      }

      const avatar = await uploadProfilePhotoUseCase(dependencies).execute({
        file: req.file,
        key,
        id,
      });
      console.log(" avatar", avatar);

      if (key === "profileImageKey") {
        await new ProfileUpdateProducer(kafka.producer).produce({
          id,
          avatar: avatar?.bucketKey,
        });
      }

      res
        .status(StatusCode.CREATED)
        .json(ResponseUtil.success(avatar?.imageUrl));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  return uploadFile;
};
