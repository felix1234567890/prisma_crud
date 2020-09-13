import { compare, hashSync } from 'bcrypt';

export interface IHashService {
  generateHash(payload: string): string;
  compareHash(payload: string, hashed: string): Promise<boolean>;
}
class BcryptService implements IHashService {
  generateHash(payload: string): string {
    return hashSync(payload, 10);
  }

  compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
export default BcryptService;
