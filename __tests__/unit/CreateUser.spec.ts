import FakeUsersRepository from '../../repository/fakes/fakeUsersRepository';
import AuthService from '../../services/AuthService';
import FakeHashService from '../../utils/fakeHashService';
import jwtAuthService, { IJWTService } from '../../utils/JwtAuthService';
import mailServiceProvider, { IMailService } from '../../utils/MailService';

let fakeUsersRepository: FakeUsersRepository;
let authService: AuthService;
let fakeHashService: FakeHashService;
let jwtService: IJWTService;
let mailService: IMailService;

describe('Create User service', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashService = new FakeHashService();
    jwtService = jwtAuthService;
    mailService = mailServiceProvider;
    authService = new AuthService(
      fakeUsersRepository,
      fakeHashService,
      jwtService,
      mailService,
    );
  });
  it('should be able to register a new user', async () => {
    const user = await authService.registerUser({
      username: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
    });
    expect(user).toHaveProperty('id');
    expect(user.role).toMatch('ADMIN');
  });
});
