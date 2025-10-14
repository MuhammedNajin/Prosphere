import { FindAllParams, FindAllResult, ICompanyRepository } from "@/infrastructure/interface/repositories/ICompanyRepository";
import { CompanyDoc, CompanyModel } from "../schema/company.schema";
import { injectable } from "inversify";
import { CompanyStatus, TeamRole } from "@/shared/constance";
import {
  ICompany,
  ICompanyVerificationDoc,
  IOwnerVerificationDoc,
  ITeamMember,
} from "@/domain/interface/ICompany";

@injectable()
export class CompanyRepository implements ICompanyRepository {
  private model = CompanyModel;

  async create(attrs: Partial<ICompany>): Promise<ICompany> {
    const company = await this.model.build(attrs).save();
    return company;
  }

  async findCompanyByStatus(status: string): Promise<ICompany[]> {
    return await this.model.find({ status }).populate("owner");
  }

  async findByName(name: string): Promise<ICompany | null> {
    return await this.model.findOne({ name }).populate("owner");
  }

  async findByWebsite(website: string): Promise<ICompany | null> {
    return await this.model.findOne({ website });
  }

  async findById(id: string): Promise<CompanyDoc | null> {
    const company = await this.model.findById(id).populate("owner")
    return company?.toJSON() || null;
  }

  async findByOwner(ownerId: string): Promise<ICompany[]> {
    return await this.model.find({ owner: ownerId });
  }

  generateId(): string {
    return this.model.generateId();
  }

  async findAll(params: FindAllParams): Promise<FindAllResult> {
    const { page, limit, skip, status, search } = params;
    
    // Build query conditions
    const query: any = {};
    
    // Add status filter if provided
    if (status && status.trim() !== '') {
      query.status = status;
    }
    
    // Add search functionality
    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
        // Add other searchable fields as needed
      ];
    }

    // Execute query with pagination
    const [companies, total] = await Promise.all([
      this.model
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),  // Sort by most recent first
      this.model.countDocuments(query)
    ]);

    return {
      companies,
      total
    };
  }

  async update(id: string, attrs: Partial<ICompany>): Promise<ICompany | null> {
    return await this.model.findByIdAndUpdate(
      id,
      { $set: attrs },
      { new: true, runValidators: true }
    );
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }

  async updateDocs(
    id: string,
    ownerDocKey: IOwnerVerificationDoc,
    companyDocKey: ICompanyVerificationDoc
  ): Promise<void> {
    const updateFields: any = { status: CompanyStatus.UNDER_REVIEW };
    
    if (ownerDocKey) updateFields.ownerVerificationDoc = ownerDocKey;
    if (companyDocKey) updateFields.companyVerificationDoc = companyDocKey;
  
    await this.model.updateOne(
      { _id: id },
      { $set: updateFields },
      { runValidators: true },
    );
  }

  async updateStatus(
    id: string,
    status: CompanyStatus
  ): Promise<ICompany | null> {
    return await this.model.findByIdAndUpdate(
      id,
      {
        $set: {
          status,
          verified: status === CompanyStatus.VERIFIED ? true : undefined,
        },
        $push: { statusHistory: { status, updatedAt: new Date() } },
      },
      { new: true, runValidators: true }
    );
  }

  async addEmployee(
    companyId: string,
    userId: string,
    role: TeamRole
  ): Promise<ICompany | null> {
    return await this.model.findByIdAndUpdate(
      companyId,
      { $addToSet: { team: { userId, role } } },
      { new: true }
    );
  }

  async findEmployees(
    companyId: string
  ): Promise<{ id: string; team?: ITeamMember[] } | null> {
    const company = await this.model
      .findOne({ _id: companyId }, { team: 1 })
      .populate("team.userId");

    if (!company) return null;

    return company;
  }
}
