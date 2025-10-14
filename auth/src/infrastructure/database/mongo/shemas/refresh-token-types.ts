import { Document, Model } from "mongoose";
import { IRefreshToken } from "@/domain/interface/IRefreshToken";

export interface IRefreshTokenDoc extends IRefreshToken, Document {
    id: string
}

export interface IRefreshTokenModel extends Model<IRefreshTokenDoc> {
  build(attrs: IRefreshToken): IRefreshTokenDoc;
}