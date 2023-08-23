import {createClient} from 'redis';
import IUserRepository from 'repository/user.irepository';
import { container } from 'tsyringe';


const redisClient = createClient();

redisClient.on('error', function (error) {
  throw new Error(error.message);
});
const userRepo = container.resolve<IUserRepository>('UserRepository');
async function cache(req, res, next) {
  const user = await userRepo.findById(req.user.id);
  redisClient
    .get(user?.username!)
    .then((cachedData) => {
      if (cachedData != null) {
        const data = JSON.parse(cachedData);
        res.status(200).send(data);
      } else {
        next();
      }
    })
    .catch((err) => {
      throw err;
    });
}

export { redisClient, cache };
