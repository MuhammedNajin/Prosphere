import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { UseCases } from "@/di/symbols";
import { SearchUserUseCase } from "@application/usecases/user/searchUser.usecase";
import { BadRequestError, HttpStatusCode, NotFoundError, ResponseMapper, ResponseWrapper } from "@muhammednajinnprosphere/common";
import { IUser } from "@/domain/interface/IUser";
import { GetMyCompanyUseCase } from "@/application/usecases/company/getMyComapany.usecase";
import { ICompany } from "@/domain/interface/ICompany";
import { CreateCompanyUseCase } from "@/application/usecases/company/createCompany.usecase";
import { CompanyStatus, TokenType } from "@/shared/constance";
import { GenerateCompanyAccessTokenUseCase } from "@/application/usecases/company/generateCompanyAccessToken.usecase";
import { ILocationPoint } from "@/shared/types/shared-types";
import { UploadCompanyVerificationDocsUseCase } from "@/application/usecases/company/uploadVerificationnDocs";

interface SearchUserResponse {
  id: string;
  username: string;
  profileImageUrl?: string;
  email: string;
}

interface CompanyResponseDTO {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  industry: string;
  locations: ILocationPoint[];
  size?: string;
  type?: string;
  owner: string;
  verified: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

@injectable()
export default class UserControllers {
  private readonly searchUserMapper: ResponseMapper<IUser, SearchUserResponse>;
  private companyMapper: ResponseMapper<ICompany, CompanyResponseDTO>;

  constructor(
    @inject(UseCases.SearchUserUseCase) private readonly searchUserUseCase: SearchUserUseCase,
    @inject(UseCases.GetMyCompanyUseCase) private readonly getMyCompanyUseCase: GetMyCompanyUseCase,
    @inject(UseCases.CreateCompanyUseCase) private readonly createCompanyUseCase: CreateCompanyUseCase,
    @inject(UseCases.GenerateCompanyAccessTokenUseCase) private readonly generateCompanyAccessTokenUseCase: GenerateCompanyAccessTokenUseCase,
    @inject(UseCases.UploadCompanyVerificationDocsUseCase) private readonly uploadCompanyVerificationDocsUseCase: UploadCompanyVerificationDocsUseCase,
  ) {

    this.companyMapper = new ResponseMapper<ICompany, CompanyResponseDTO>({
      fields: {
        id: 'id',
        name: 'name',
        industry: 'industry',
        website: 'website',
        locations: 'locations',
        size: 'size',
        type: 'type',
        owner: 'owner',
        logo: 'logo',
        verified: 'verified',
        status: 'status',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
      }
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

  uploadCompanyVerificationDocs = async (req: Request, res: Response): Promise<void> => {
    const wrapper = new ResponseWrapper(res);
    const { id } = req.params;
    const { companyDocType, ownerDocType } = req.body;
    const { companyDoc, ownerDoc } = req.files as { 
      companyDoc: Express.Multer.File[]; 
      ownerDoc: Express.Multer.File[] 
    };

    console.log('Files received:', {
      companyDoc: companyDoc ? companyDoc[0]?.originalname : null,
      ownerDoc: ownerDoc ? ownerDoc[0]?.originalname : null
    });

      const result = await this.uploadCompanyVerificationDocsUseCase.execute({
        id,
        companyDocType,
        ownerDocType,
        companyDocFile: companyDoc[0],
        ownerDocFile: ownerDoc[0]
      });
     
      
      wrapper
        .status(HttpStatusCode.OK)
        .success(
          {}, 
          "Company verification documents uploaded successfully."
        );
  };

  

  createCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const wrapper = new ResponseWrapper(res);
  const userData = req.headers["x-user-data"] ? JSON.parse(req.headers["x-user-data"] as string) : {};
  const { userId: ownerId } = userData;
  const { name, website, location, size, type } = req.body;

  const company = await this.createCompanyUseCase.execute({
    name,
    website,
    locations: location,
    size,
    type,
    owner: ownerId,
  });

  const response = this.companyMapper.toResponse(company);
  
  wrapper
    .status(HttpStatusCode.CREATED)
    .success(response, "Company created successfully.");
};


generateCompanyAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const wrapper = new ResponseWrapper(res);
    const { id } = req.params;
    const { company, accessToken } = await this.generateCompanyAccessTokenUseCase.execute(id);
    

    const response = this.companyMapper.toResponse(company)

    wrapper
      .status(HttpStatusCode.OK)
      .cookie(TokenType.COMPANY_ACCESS_TOKEN, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 4 * 60 * 60 * 1000,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      })
      .success(response, "Company access token generated successfully.");
  };

  getMyCompany = async(req: Request, res: Response): Promise<void> => {
      const wrapper = new ResponseWrapper(res);
      const userData = req.headers["x-user-data"] ? JSON.parse(req.headers["x-user-data"] as string) : {};
      const { userId } = userData;
      console.log("userData", userData);  
      if (!userId) {
        throw new BadRequestError("User ID is required in headers.");
      }
  
      const company = await this.getMyCompanyUseCase.execute(userId);
      if (!company) {
        throw new NotFoundError("No company found for the user.");
      }

      const response = this.companyMapper.toResponseList(company);
  
      wrapper
        .status(HttpStatusCode.OK)
        .success(response, "Company retrieved successfully.");
    }

  search = async (req: Request, res: Response): Promise<void> => {
    const { search } = req.query;
    if (!search || typeof search !== "string") {
      throw new BadRequestError("Search query is required and must be a string");
    }

    const users = await this.searchUserUseCase.execute(search);
    const mappedUsers = this.searchUserMapper.toResponseList(users);

    new ResponseWrapper(res).status(HttpStatusCode.OK).success(mappedUsers, "Users retrieved successfully");
  };
}
