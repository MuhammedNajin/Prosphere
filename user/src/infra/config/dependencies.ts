import { profileRepository } from "@infra/repository";
import { ProfileUpdateProducer } from '@infra/messageBroker/kafka/producer/profile-update-producer'
import {
 uploadProfilePhotoUseCase,
 createProfileUseCase,
 aboutUseCase,
 getProfileUseCase,
 updateProfileUseCase,
 uploadResumeUseCase,
 getUploadedFileUseCase,
 deleteFileUseCase
} from '@application/usecase'

import s3Operation from '@infra/service/aws-s3-bucker';
import { resizeImage } from "@infra/service/sharp";
import { redisClient } from './database'
import { kafka } from "./messageBroker";

const service = {
  s3Operation,
  resizeImage,
  redisClient,
}

const messageBroker = {
   ProfileUpdateProducer,
   kafka
}

const useCases = {
  uploadProfilePhotoUseCase,
  createProfileUseCase,
  aboutUseCase,
  getProfileUseCase,
  updateProfileUseCase,
  uploadResumeUseCase,
  getUploadedFileUseCase,
  deleteFileUseCase
}

const repository = {
   profileRepository
}

export default {
    useCases,
    repository,
    service,
    messageBroker
}