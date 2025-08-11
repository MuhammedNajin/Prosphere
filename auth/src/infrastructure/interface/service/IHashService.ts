export interface IHashService {
    hash(password: string): Promise<string>;
    compare(plainText: string, hashedPassword: string): Promise<boolean>;
  }
