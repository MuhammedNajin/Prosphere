import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

interface User {
  _id: string; 
  username: string;
  email: string;
  phone: string;
  jobRole: string;
}

interface GetProfileRequest {
    _id: string,
}

interface Resume {
    resumeKey: string[]
}

export class GrpcServer {
  private server: grpc.Server;
  private authProto: any;
  private dependencies: any;
  constructor(dependencies: any) {
    try {
        
        
      this.dependencies = dependencies;
      const PROTO_PATH = path.resolve("node_modules/@muhammednajinnprosphere/common/src/protoFiles/user.proto");
      const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
      this.authProto = grpc.loadPackageDefinition(packageDefinition).auth as any;
      this.server = new grpc.Server();
      this.addUserServices();
    } catch (error) {
        console.log(error);
        throw new Error()
    }
  }

  private addUserServices() {
    this.server.addService(
      this.authProto.UserService.service,
      this.getServiceImplementation()
    );
  }

  private getServiceImplementation(): grpc.UntypedServiceImplementation {
    return {
      createUser: this.createUser.bind(this),
      getUserProfile: this.getUserProfile.bind(this),
    };
  }

  private async getUserProfile(call: grpc.ServerUnaryCall<GetProfileRequest, Resume>,
    callback: grpc.sendUnaryData<Resume>): Promise<void> {
     try {
        const { _id } = call.request;
        console.log("getUserPofile grpc call", _id);
        
        const {useCases: {
            getProfileUseCase
        } } = this.dependencies;
        
        const profile = await getProfileUseCase(this.dependencies).execute({ _id })
        // console.log("profile", profile, profile.resumeKey);
        const response = {
            resumeKey: profile?.resumeKey || [],
        }
        console.log("resumekey", response)
        callback(null, response);
     } catch (error) {
        console.log(error);
     }
  }

  private async createUser(
    call: grpc.ServerUnaryCall<User, User>,
    callback: grpc.sendUnaryData<User>
  ): Promise<void> {
    const { _id, username, email, phone, jobRole } = call.request;
    console.log("request", call.request);
    const {useCases: {
        createProfileUseCase
    } } = this.dependencies;
    const user = await createProfileUseCase(this.dependencies).execute(
      call.request
    );
    console.log("user doc from grpc", user);
    callback(null, call.request);
  }

  public start(port: number = 50051) {
    this.server.bindAsync(
      `0.0.0.0:${port}`,
      grpc.ServerCredentials.createInsecure(),
      (err: Error | null) => {
        if (err) {
          console.error("Failed to bind server:", err.message);
        }
        console.log(`Profile Service running on port ${port}`);
      }
    );
  }
}
