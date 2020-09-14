import redis from 'redis';
import IUserRepository from 'repository/user.irepository';
import { container } from 'tsyringe';

const REDIS_PORT = parseInt(process.env.REDIS_PORT as string) || 6379;

const redisClient = redis.createClient({ port: REDIS_PORT });

redisClient.on('error', function (error) {
  throw new Error(error.message);
});
const userRepo = container.resolve<IUserRepository>('UserRepository');
async function cache(req, res, next) {
  const user = await userRepo.findById(req.user.id);
  redisClient.get(user?.username!, (error, cachedData) => {
    if (error) throw error;
    console.log(cachedData);
    if (cachedData != null) {
      const data = JSON.parse(cachedData);
      res.status(200).send(data);
    } else {
      next();
    }
  });
}

export { redisClient, cache };
