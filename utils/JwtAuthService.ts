import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { injectable } from 'tsyringe';

interface IAuthSettings {
  jwtSecret: string;
  jwtExpirationTime: string;
}

export interface IAuthService {
  authenticateUser(user: User): string;
}
@injectable()
class JWTAuthService implements IAuthService {
  constructor(private readonly authSettings: IAuthSettings) {}
  public authenticateUser(user: User) {
    const token = jwt.sign({ id: user.id }, this.authSettings.jwtSecret, {
      expiresIn: this.authSettings.jwtExpirationTime,
    });
    return token;
  }
}
export default new JWTAuthService({
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpirationTime: '7d',
});
