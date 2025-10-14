import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { UseCases } from "@/di/symbols";
import { AboutUseCase } from "@/application/usecase/user/about.usecase";
import { DeleteResumeUseCase } from "@/application/usecase/user/deleteResume.usecase";
import { GetProfileUseCase } from "@/application/usecase/user/getProfile.usecase";
import { GetUploadedFileUseCase } from "@/application/usecase/user/getUploadedFile.usecase";
import { SearchUserUseCase } from "@/application/usecase/user/searchUser.usecase";
import { UpdateProfileUseCase, UpdateType } from "@/application/usecase/user/updateProfile.usecase";
import { UploadProfilePhotoUseCase, ProfilePhotoType } from "@/application/usecase/user/uploadImage.usecase";
import { UploadResumeUseCase } from "@/application/usecase/user/uploadResume.usecase";
import { DeleteFileUseCase } from "@/application/usecase/user/deleteFile.usecase";
import { BadRequestError, HttpStatusCode, ResponseMapper, ResponseWrapper } from "@muhammednajinnprosphere/common";
import { IUser } from "@/domain/interface/IUser";

interface UserProfileResponse {
  id: string;
  email: string;
  username: string;
  about?: string;
  profileImageUrl?: string;
  coverImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SearchUserResponse {
  id: string;
  username: string;
  profileImageUrl?: string;
  email: string;
}

interface FileUploadResponse {
  url: string;
  key: string;
  uploadedAt: Date;
}

@injectable()
export default class UserControllers {
  private readonly userProfileMapper: ResponseMapper<IUser, Omit<IUser, 'role'>>;
  private readonly searchUserMapper: ResponseMapper<IUser, SearchUserResponse>;

  constructor(
    @inject(UseCases.AboutUseCase) private readonly aboutUseCase: AboutUseCase,
    @inject(UseCases.DeleteResumeUseCase) private readonly deleteResumeUseCase: DeleteResumeUseCase,
    @inject(UseCases.GetProfileUseCase) private readonly getProfileUseCase: GetProfileUseCase,
    @inject(UseCases.GetUploadedFileUseCase) private readonly getUploadedFileUseCase: GetUploadedFileUseCase,
    @inject(UseCases.SearchUserUseCase) private readonly searchUserUseCase: SearchUserUseCase,
    @inject(UseCases.UpdateProfileUseCase) private readonly updateProfileUseCase: UpdateProfileUseCase,
    @inject(UseCases.UploadProfilePhotoUseCase) private readonly uploadProfilePhotoUseCase: UploadProfilePhotoUseCase,
    @inject(UseCases.UploadResumeUseCase) private readonly uploadResumeUseCase: UploadResumeUseCase,
    @inject(UseCases.DeleteFileUseCase) private readonly deleteFileUseCase: DeleteFileUseCase
  ) {
    this.userProfileMapper = new ResponseMapper<IUser, Omit<IUser, 'role'>>({
      fields: {
        id: "id",
        email: "email",
        username: "username",
        about: "about",
        profileImageKey: "profileImageKey",
        coverImageKey: "coverImageKey",
        headline: 'headline',
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        experience: 'experience',
        education: 'education',
        skills: 'skills',
        location: 'location',
        socialLinks: 'socialLinks',
        resumeKeys: 'resumeKeys'
      },
    });

    this.searchUserMapper = new ResponseMapper<IUser, SearchUserResponse>({
      fields: {
        id: "id",
        username: "username",
        profileImageUrl: "profileImageKey",
        email: "email",
      },
    });
  }

  aboutMe = async (req: Request, res: Response): Promise<void> => {
    const { description } = req.body;
    const userData = JSON.parse(req.headers["x-user-data"] as string);

    if (!description || !userData.userId) {
      throw new BadRequestError("Description and ID are required");
    }

    const user = await this.aboutUseCase.execute({ description, id: userData.userId });
    if (!user) throw new BadRequestError("User not found");

    const mappedUser = this.userProfileMapper.toResponse(user);
    new ResponseWrapper(res)
      .status(HttpStatusCode.OK)
      .success(mappedUser, "About section updated successfully");
  };

  deleteResume = async (req: Request, res: Response): Promise<void> => {
    const { key } = req.params;
    const userData = req.headers["x-user-data"];
    if (!userData) throw new BadRequestError("User data not found in headers");

    const { userId } = JSON.parse(userData as string);
    if (!key || !userId) throw new BadRequestError("Resume key and user ID are required");

    await this.deleteResumeUseCase.execute(key, userId);
    new ResponseWrapper(res)
      .status(HttpStatusCode.OK)
      .success({ deleted: true, key }, "Resume deleted successfully");
  };

  getProfile = async (req: Request, res: Response): Promise<void> => {
    const userData = JSON.parse(req.headers["x-user-data"] as string);
    console.log("user data from jwt payload", userData)
    if (!userData.userId) throw new BadRequestError("User ID is required");

    const profile = await this.getProfileUseCase.execute(userData.userId);
    if (!profile) throw new BadRequestError("Profile not found");

    const mappedProfile = this.userProfileMapper.toResponse(profile);
    new ResponseWrapper(res)
      .status(HttpStatusCode.OK)
      .success(mappedProfile, "Profile retrieved successfully");
  };

  getUser = async (req: Request, res: Response): Promise<void> => {
    const { id: userId} = req.params
    console.log("getUser controller params", userId)
    if (!userId) throw new BadRequestError("User ID is required");

    const profile = await this.getProfileUseCase.execute(userId);
    if (!profile) throw new BadRequestError("Profile not found");

    const mappedProfile = this.userProfileMapper.toResponse(profile);
    new ResponseWrapper(res)
      .status(HttpStatusCode.OK)
      .success(mappedProfile, "Profile retrieved successfully");
  };

  getUploadedFile = async (req: Request, res: Response): Promise<void> => {
    console.log("get uploaded file resume", req.params)
    const { key } = req.params;
    if (!key) throw new BadRequestError("File key is required");

    const fileUrl = await this.getUploadedFileUseCase.execute(key);
    if (!fileUrl) throw new BadRequestError("File not found");

    const response: FileUploadResponse = { url: fileUrl, key, uploadedAt: new Date() };
    new ResponseWrapper(res).status(HttpStatusCode.OK).success(response, "File retrieved successfully");
  };

  getFiles = async (req: Request, res: Response): Promise<void> => {
    const { keys } = req.body;
    if (!Array.isArray(keys) || keys.length === 0) {
      throw new BadRequestError("Keys must be a non-empty array");
    }

    const urls = await Promise.all(
      keys.map(async (key: string) => {
        if (typeof key !== "string") throw new BadRequestError("All keys must be strings");
        const url = await this.getUploadedFileUseCase.execute(key);
        return { url, key, uploadedAt: new Date() } as FileUploadResponse;
      })
    );

    new ResponseWrapper(res).status(HttpStatusCode.OK).success(urls, "Files retrieved successfully");
  };

  search = async (req: Request, res: Response): Promise<void> => {
    const { search } = req.query;
    if (!search || typeof search !== "string") {
      throw new BadRequestError("Search query is required and must be a string");
    }

    const users = await this.searchUserUseCase.execute(search);
    console.log("Users found:", users);
    const mappedUsers = this.searchUserMapper.toResponseList(users);

    new ResponseWrapper(res).status(HttpStatusCode.OK).success(mappedUsers, "Users retrieved successfully");
  };

  updateProfile = async (req: Request, res: Response): Promise<void> => {
    const userData = req.headers["x-user-data"];
    if (!userData) throw new BadRequestError("User data not found in headers");

    const { userId } = JSON.parse(userData as string);
    const { updateType, arrayField } = req.query as { updateType?: string; arrayField?: string };
    if (!userId) throw new BadRequestError("User ID is required");

    const mappedUpdateType: UpdateType | undefined =
      updateType === "array_push"
        ? UpdateType.ARRAY_PUSH
        : updateType === "array_pull"
        ? UpdateType.ARRAY_PULL
        : updateType === "array_set"
        ? UpdateType.ARRAY_SET
        : updateType === "replace"
        ? UpdateType.REPLACE
        : undefined;

    const updatedUser = await this.updateProfileUseCase.execute({
      id: userId,
      updateData: req.body,
      updateType: mappedUpdateType,
      arrayField,
    });

    const mappedUser = this.userProfileMapper.toResponse(updatedUser);
    new ResponseWrapper(res).status(HttpStatusCode.OK).success(mappedUser, "Profile updated successfully");
  };

  uploadProfilePhoto = async (req: Request, res: Response): Promise<void> => {
    const { key, existingKey } = req.query as { key: string; existingKey?: string };
    const userData = req.headers["x-user-data"];
    if (!userData) throw new BadRequestError("User data not found in headers");

    const { userId } = JSON.parse(userData as string);
    if (!req.file) throw new BadRequestError("File is required");
    if (!key || !userId) throw new BadRequestError("Photo type key and user ID are required");

    const validKeys = ["profileImageKey", "coverImageKey"];
    if (!validKeys.includes(key)) throw new BadRequestError("Invalid photo type key");

    if (existingKey) {
      await this.deleteFileUseCase.execute(existingKey);
    }

    const photoType =
      key === "profileImageKey" ? ProfilePhotoType.PROFILE_IMAGE : ProfilePhotoType.COVER_IMAGE;

    const uploadResult = await this.uploadProfilePhotoUseCase.execute({
      file: req.file as Express.Multer.File,
      userId,
      photoType,
    });

    const response: FileUploadResponse = {
      url: uploadResult.imageUrl,
      key: uploadResult.bucketKey,
      uploadedAt: uploadResult.uploadedAt,
    };

    new ResponseWrapper(res).status(HttpStatusCode.CREATED).success(response, "Profile photo uploaded successfully");
  };

  uploadResume = async (req: Request, res: Response): Promise<void> => {
    const userData = req.headers["x-user-data"];
    if (!userData) throw new BadRequestError("User data not found in headers");
    console.log("req file in upload resume", req.file, req.files)
    const { userId } = JSON.parse(userData as string);
    if (!req.file) throw new BadRequestError("File is required");
    if (!userId) throw new BadRequestError("User ID is required");

    const response = await this.uploadResumeUseCase.execute({
      file: req.file as Express.Multer.File,
      id: userId,
    });

    new ResponseWrapper(res).status(HttpStatusCode.CREATED).success(response, "Resume uploaded successfully");
  };
}
