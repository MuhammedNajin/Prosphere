import { Repository } from "typeorm";
import { Plan } from "../database/sql/entities/plan.entity";
import { AppDataSource } from "../database/sql/connection";
import { IPlan } from "@/shared/types/plan.interface";
import { IPlanRepository } from "@/domain/IRespository/IPlan.repository";
import { BadRequestError } from "@muhammednajinnprosphere/common";

class PlanRepository implements IPlanRepository {
  private repository: Repository<Plan>;

  constructor() {
    this.repository = AppDataSource.getRepository(Plan);
  }

  private handleDBError() {
     
  }

  async createPlan(planDTO: IPlan): Promise<Plan> {
    try {
      const exist = await this.repository.findOne({
        where: { durationInDays: planDTO.durationInDays },
      });

      console.log("exist", exist);

      if (exist) {
        throw new BadRequestError(`Plan already exists with ${planDTO.durationInDays} duration`);
      }

      const planEntity = new Plan();
      planEntity.name = planDTO.name;
      planEntity.features = planDTO.features;
      planEntity.price = planDTO.price;
      planEntity.durationInDays = planDTO.durationInDays;

      const plan = this.repository.create(planEntity);
      return await this.repository.save(plan);
    } catch (error) {
      throw error;
    }
  }

  async get(): Promise<IPlan[] | null> {
    try {
      return await this.repository.find();
    } catch (error) {
      throw new Error();
    }
  }

  async getPlan(id: number): Promise<IPlan | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async editPlan(id: number, query: object): Promise<IPlan | null> {
    return await this.repository.update({ id }, query);
  }

  async deletePlan(id: number): Promise<void> {
    await this.repository.delete({
      id,
    });
  }
}

export default new PlanRepository();
