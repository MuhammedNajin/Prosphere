import { profileRepository } from "@infra/repository";

import {
 uploadProfilePhotoUseCase,
 createProfileUseCase,
 aboutUseCase,
 getProfileUseCase,
 updateProfileUseCase,
 uploadResumeUseCase,
 getUploadedFileUseCase
} from '@application/usecase'

import s3Operation from '@infra/service/aws-s3-bucker';
import { resizeImage } from "@infra/service/sharp";
import { redisClient } from './database'

const service = {
  s3Operation,
  resizeImage,
  redisClient,
}

const useCases = {
  uploadProfilePhotoUseCase,
  createProfileUseCase,
  aboutUseCase,
  getProfileUseCase,
  updateProfileUseCase,
  uploadResumeUseCase,
  getUploadedFileUseCase
}

const repository = {
   profileRepository
}

export default {
    useCases,
    repository,
    service
}