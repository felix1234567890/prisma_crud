import { container } from 'tsyringe';
import IUserRepository from '../repository/user.irepository';
import UserRepository from '../repository/user.repository';
import authService, { IAuthService } from './JwtAuthService';

import mailService, { IMailService } from './MailService';
import BcryptService, { IHashService } from './BcryptService';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
container.register<IAuthService>('AuthService', { useValue: authService });
container.register<IMailService>('MailService', { useValue: mailService });
container.registerSingleton<IHashService>('HashService', BcryptService);
