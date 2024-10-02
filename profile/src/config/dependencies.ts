import { profileRepository } from "../app/repository";

import {
 uploadProfilePhotoUseCase,
 createProfileUseCase,
 aboutUseCase,
 getProfileUseCase,
 updateProfileUseCase
} from '../usecase'

import s3Operation from '../app/service/aws-s3-bucker';
import { resizeImage } from "../app/service/sharp";

const service = {
  s3Operation,
  resizeImage,
}

const useCases = {
  uploadProfilePhotoUseCase,
  createProfileUseCase,
  aboutUseCase,
  getProfileUseCase,
  updateProfileUseCase,
}

const repository = {
   profileRepository
}

export default {
    useCases,
    repository,
    service
}