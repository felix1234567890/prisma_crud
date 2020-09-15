import { IHashService } from './BcryptService';

class FakeHashService implements IHashService {
  generateHash(payload: string): string {
    return payload;
  }

  compareHash(payload: string, hashed: string): Promise<boolean> {
    return Promise.resolve(payload === hashed);
  }
}
export default FakeHashService;
