import { container } from 'tsyringe';
import IUserRepository from '../repository/user.irepository';
import UserRepository from '../repository/user.repository';
import { IAuthService } from './JwtAuthService';
import authService from './JwtAuthService';
import { IMailService } from './MailService';
import mailService from './MailService';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
container.register<IAuthService>('AuthService', { useValue: authService });
container.register<IMailService>('MailService', { useValue: mailService });
