import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import IUserRepository from 'repository/user.irepository';

export default function roleMiddleware(roles) {
  if (typeof roles === 'string') {
    roles = [roles];
  }
  return async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.user.id);
    const userRepository = container.resolve<IUserRepository>('UserRepository');
    const user = await userRepository.findById(id);
    if (user) {
      if (roles.length && !roles.includes(user.role)) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      next();
    }
  };
}
