import userRepository from './mongo/auth.repository';
import otpRepository from './mongo/otp.repository';
import redisRepository from './redis/user.redis'

export { userRepository, otpRepository, redisRepository };