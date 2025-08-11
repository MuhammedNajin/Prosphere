// import {
//   sendUnaryData,
//   ServerUnaryCall,
//   status as GrpcStatus,
// } from "@grpc/grpc-js";
// import { inject } from "inversify";
// import { grpcUnaryHandler, ResponseMapper } from "@muhammednajinnprosphere/common";
// import { HttpStatusCode } from "@muhammednajinnprosphere/common";

// import {
//   SigninRequest,
//   SigninResponse,
//   SignupRequest,
//   SignupResponse,
//   VerifyOtpRequest,
//   VerifyOtpResponse,
//   ForgotPasswordRequest,
//   ForgotPasswordResponse,
//   ResetPasswordRequest,
//   ResetPasswordResponse,
//   GoogleAuthRequest,
//   GoogleAuthResponse,
//   GoogleAuthFlowRequest,
//   GoogleAuthFlowResponse,
//   RefreshTokenRequest,
//   RefreshTokenResponse,
//   ChangePasswordRequest,
//   ChangePasswordResponse,
//   AuthServiceServer,
//   User,
// } from "@infrastructure/rpc/grpc/generated/user";

// import { UseCases } from "@/di/symbols";
// import { SigninUseCase } from "@/application/usecase/auth/signin.usecase";
// import { SignupUseCase } from "@/application/usecase/auth/signup.usecase";
// import { VerifyOtpUseCase } from "@/application/usecase/auth/verify-otp.usecase";
// import { ResetPasswordUseCase } from "@/application/usecase/auth/resetPassUsecase";
// import { ForgetPasswordUseCase } from "@/application/usecase/auth/forget-pass.usecase";
// import { ChangePasswordUseCase } from "@/application/usecase/auth/change-password.usecase";
// import { GoogleAuthUseCase } from "@/application/usecase/auth/google-auth.usecase";
// import { GoogleAuthFlowUseCase } from "@/application/usecase/auth/google-auth-flow.usecase";
// import { RefreshTokenUseCase } from "@/application/usecase/auth/refresh-token.usecase";
// import { IAuth } from "@/domain/interface/IAuth";

// /**
//  * Maps an HTTP status code to a gRPC status code.
//  * This helper function ensures consistent error handling across the service.
//  */
// const mapToGrpcStatus = (httpStatus: HttpStatusCode): GrpcStatus => {
//   switch (httpStatus) {
//     case HttpStatusCode.BAD_REQUEST:
//       return GrpcStatus.INVALID_ARGUMENT;
//     case HttpStatusCode.UNAUTHORIZED:
//       return GrpcStatus.UNAUTHENTICATED;
//     case HttpStatusCode.FORBIDDEN:
//       return GrpcStatus.PERMISSION_DENIED;
//     case HttpStatusCode.NOT_FOUND:
//       return GrpcStatus.NOT_FOUND;
//     case HttpStatusCode.CONFLICT:
//       return GrpcStatus.ALREADY_EXISTS;
//     case HttpStatusCode.INTERNAL_SERVER:
//       return GrpcStatus.INTERNAL;
//     default:
//       return GrpcStatus.INTERNAL;
//   }
// };

// /**
//  * Converts application user model to gRPC User type using ResponseMapper.
//  * This ensures consistent formatting between HTTP and gRPC responses.
//  */
// const convertToGrpcUser = (user: IAuth): User => {
//   // Use the same ResponseMapper configuration as in HTTP controller
//   const responseMapper = new ResponseMapper<IAuth, User>({
//     fields: {
//       id: "id",
//       email: "email",
//       username: "username",
//       phone: "phone",
//       role: "role",
//       createdAt: "createdAt",
//       updatedAt: "updatedAt",
//     }
//   });

//   return responseMapper.toResponse(user);
// };

// /**
//  * AuthGrpcService implements the gRPC authentication service.
//  * This class handles all authentication-related operations including signin, signup,
//  * OTP verification, password management, and OAuth flows.
//  * 
//  * Now includes ResponseMapper for consistent user data formatting.
//  */
// export class AuthGrpcService implements AuthServiceServer {
//   // Private properties for dependency injection - these won't be exposed as gRPC methods
//   [key: string]: any; // Index signature to satisfy gRPC interface

//   constructor(
//     // Core authentication use cases - note the explicit private marking
//     @inject(UseCases.SigninUseCase) private readonly signinUseCase: SigninUseCase,
//     @inject(UseCases.SignupUseCase) private readonly signupUseCase: SignupUseCase,
//     @inject(UseCases.VerifyOtpUseCase) private readonly verifyOtpUseCase: VerifyOtpUseCase,
//     @inject(UseCases.ResetPasswordUseCase) private readonly resetPasswordUseCase: ResetPasswordUseCase,
//     @inject(UseCases.ForgetPasswordUseCase) private readonly forgetPasswordUseCase: ForgetPasswordUseCase,
//     @inject(UseCases.ChangePasswordUseCase) private readonly changePasswordUseCase: ChangePasswordUseCase,
//     @inject(UseCases.GoogleAuthUseCase) private readonly googleAuthUseCase: GoogleAuthUseCase,
//     @inject(UseCases.GoogleAuthFlowUseCase) private readonly googleAuthFlowUseCase: GoogleAuthFlowUseCase,
//     @inject(UseCases.RefreshTokenUseCase) private readonly refreshTokenUseCase: RefreshTokenUseCase
//   ) {}

//   /**
//    * Handles user signin with email and password.
//    * This method authenticates the user and returns tokens along with formatted user information.
//    */
//   signin = grpcUnaryHandler<SigninRequest, SigninResponse>(
//     async (
//       call: ServerUnaryCall<SigninRequest, SigninResponse>,
//       callback: sendUnaryData<SigninResponse>
//     ) => {
//       const { email, password } = call.request;
      
//       // Use the signin use case to authenticate the user
//       const { user, accessToken, refreshToken } = await this.signinUseCase.execute({
//         email,
//         password,
//       });

//       const response: SigninResponse = {
//         accessToken,
//         refreshToken,
//         user: convertToGrpcUser(user),
//       };

//       callback(null, response);
//     }
//   );

//   /**
//    * Handles user registration.
//    * Creates a new user account and sends OTP for verification.
//    */
//   signup = grpcUnaryHandler<SignupRequest, SignupResponse>(
//     async (
//       call: ServerUnaryCall<SignupRequest, SignupResponse>,
//       callback: sendUnaryData<SignupResponse>
//     ) => {
//       // Extract all fields from the signup request
//       const { email, password, username, phone, location, companyName } = call.request;
      
//       // Prepare the signup data, handling optional fields
//       const signupData: any = {
//         email,
//         password,
//         username,
//         phone: phone || "",
//         ...(location && { 
//           location: {
//             placeName: location.placeName,
//             type: location.type,
//             coordinates: location.coordinates,
//           }
//         }),
//         ...(companyName && { companyName }),
//       };

//       await this.signupUseCase.execute(signupData);

//       const response: SignupResponse = {
//         success: true,
//         message: "Account created successfully. Please verify your OTP.",
//       };

//       callback(null, response);
//     }
//   );

//   /**
//    * Verifies the OTP sent during registration or login.
//    * Upon successful verification, returns formatted user data and authentication tokens.
//    */
//   verifyOtp = grpcUnaryHandler<VerifyOtpRequest, VerifyOtpResponse>(
//     async (
//       call: ServerUnaryCall<VerifyOtpRequest, VerifyOtpResponse>,
//       callback: sendUnaryData<VerifyOtpResponse>
//     ) => {
//       const { email, otp } = call.request;
      
//       // Verify OTP and get user data with tokens
//       const { user, accessToken, refreshToken } = await this.verifyOtpUseCase.execute({
//         otpFromUser: otp,
//         email,
//       });

//       const response: VerifyOtpResponse = {
//         accessToken,
//         refreshToken,
//         user: convertToGrpcUser(user),
//       };

//       callback(null, response);
//     }
//   );

//   /**
//    * Initiates the forgot password flow.
//    * Sends a password reset link or OTP to the user's email.
//    */
//   forgotPassword = grpcUnaryHandler<ForgotPasswordRequest, ForgotPasswordResponse>(
//     async (
//       call: ServerUnaryCall<ForgotPasswordRequest, ForgotPasswordResponse>,
//       callback: sendUnaryData<ForgotPasswordResponse>
//     ) => {
//       const { email } = call.request;
      
//       await this.forgetPasswordUseCase.execute(email);

//       const response: ForgotPasswordResponse = {
//         success: true,
//         message: "A password reset link has been sent to your email.",
//       };

//       callback(null, response);
//     }
//   );

//   /**
//    * Resets the user's password using a reset token.
//    * The token is typically sent via email in the forgot password flow.
//    */
//   resetPassword = grpcUnaryHandler<ResetPasswordRequest, ResetPasswordResponse>(
//     async (
//       call: ServerUnaryCall<ResetPasswordRequest, ResetPasswordResponse>,
//       callback: sendUnaryData<ResetPasswordResponse>
//     ) => {
//       const { token, newPassword } = call.request;
      
//       await this.resetPasswordUseCase.execute({ email: "", token, newPassword });

//       const response: ResetPasswordResponse = {
//         success: true,
//         message: "Password reset successfully.",
//       };

//       callback(null, response);
//     }
//   );

//   /**
//    * Handles Google OAuth authentication.
//    * Processes Google token and either creates new user or authenticates existing one.
//    * Returns formatted user data when profile is complete.
//    */
//   googleAuth = grpcUnaryHandler<GoogleAuthRequest, GoogleAuthResponse>(
//     async (
//       call: ServerUnaryCall<GoogleAuthRequest, GoogleAuthResponse>,
//       callback: sendUnaryData<GoogleAuthResponse>
//     ) => {
//       const { token: googleToken } = call.request;
      
//       if (!googleToken) {
//         return callback(
//           {
//             name: "GoogleAuthError",
//             message: "No Google token provided",
//             code: GrpcStatus.INVALID_ARGUMENT,
//           },
//           null
//         );
//       }

//       const result = await this.googleAuthUseCase.execute(googleToken);

//       let grpcUser: User | undefined = undefined;
//       let accessToken: string | undefined = undefined;
//       let refreshToken: string | undefined = undefined;
//       let profileComplete = false;

//       if (result.profile_complete && result.user) {
//         grpcUser = convertToGrpcUser(result.user);
//         accessToken = result.accessToken;
//         refreshToken = result.refreshToken;
//         profileComplete = true;
//       }

//       const response: GoogleAuthResponse = {
//         accessToken,
//         refreshToken,
//         user: grpcUser,
//         profileComplete,
//       };

//       callback(null, response);
//     }
//   );

//   /**
//    * Completes Google authentication flow with additional profile information.
//    * Used when initial Google auth requires additional user details.
//    * Returns formatted user data upon completion.
//    */
//   googleAuthFlow = grpcUnaryHandler<GoogleAuthFlowRequest, GoogleAuthFlowResponse>(
//     async (
//       call: ServerUnaryCall<GoogleAuthFlowRequest, GoogleAuthFlowResponse>,
//       callback: sendUnaryData<GoogleAuthFlowResponse>
//     ) => {
//       const { location, phone, email } = call.request;
      
//       // Process Google auth flow with additional profile data
//       const result = await this.googleAuthFlowUseCase.execute({
//         email,
//         phone,
//       });

//       const response: GoogleAuthFlowResponse = {
//         accessToken: result.accessToken,
//         refreshToken: result.refreshToken,
//         user: convertToGrpcUser(result.user),
//       };

//       callback(null, response);
//     }
//   );

//   /**
//    * Refreshes the access token using a valid refresh token.
//    * This extends the user's session without requiring re-authentication.
//    */
//   refreshToken = grpcUnaryHandler<RefreshTokenRequest, RefreshTokenResponse>(
//     async (
//       call: ServerUnaryCall<RefreshTokenRequest, RefreshTokenResponse>,
//       callback: sendUnaryData<RefreshTokenResponse>
//     ) => {
//       const { refreshToken: token } = call.request;
      
//       const { accessToken, refreshToken: newRefreshToken } = await this.refreshTokenUseCase.execute(token);

//       const response: RefreshTokenResponse = {
//         accessToken,
//         refreshToken: newRefreshToken,
//       };

//       callback(null, response);
//     }
//   );

//   /**
//    * Changes the user's password.
//    * Requires the current password for security verification.
//    */
//   changePassword = grpcUnaryHandler<ChangePasswordRequest, ChangePasswordResponse>(
//     async (
//       call: ServerUnaryCall<ChangePasswordRequest, ChangePasswordResponse>,
//       callback: sendUnaryData<ChangePasswordResponse>
//     ) => {
//       // Note: The protobuf uses 'id', 'oldPassword', 'newPassword'
//       const { id: userId, oldPassword, newPassword } = call.request;
      
//       await this.changePasswordUseCase.execute(oldPassword, newPassword, userId);

//       const response: ChangePasswordResponse = {
//         success: true,
//         message: "Password changed successfully.",
//       };

//       callback(null, response);
//     }
//   );
// }