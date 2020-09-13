import { container } from 'tsyringe';
import IUserRepository from '../repository/user.irepository';
import UserRepository from '../repository/user.repository';
import authService, { IJWTService } from './JwtAuthService';
import mailService, { IMailService } from './MailService';
import BcryptService, { IHashService } from './BcryptService';
import BookRepository, { IBookRepository } from 'repository/book.repository';
import ReviewRepository, {
  IReviewRepository,
} from 'repository/review.repository';
import ProfileRepository, {
  IProfileRepository,
} from 'repository/profile.repository';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
container.registerSingleton<IBookRepository>('BookRepository', BookRepository);
container.registerSingleton<IProfileRepository>(
  'ProfileRepository',
  ProfileRepository,
);
container.registerSingleton<IReviewRepository>(
  'ReviewRepository',
  ReviewRepository,
);
container.registerSingleton<IHashService>('HashService', BcryptService);

container.register<IJWTService>('JWTService', { useValue: authService });
container.register<IMailService>('MailService', { useValue: mailService });
