import FakeUserRepository from '../../repository/fakes/FakeUserRepository';
import CreateUserService from '../../services/CreateUserService';

let fakeUserRepository: FakeUserRepository;
let createUserService: CreateUserService;
CreateUserService;

describe('Create User service', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    createUserService = new CreateUserService(fakeUserRepository);
  });
  it('Should be able to create new user', async () => {
    const user = await createUserService.execute({
      username: 'frane10',
      email: 'frane10@gmail.com',
      password: 'frane55',
    });
    expect(user).toHaveProperty('id');
    expect(user.username).toMatch('frane10');
  });
});
