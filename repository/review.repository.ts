import { injectable } from 'tsyringe';
import { prisma } from 'index';
import { Review } from '@prisma/client';
import AppError from 'utils/AppError';

export interface IReviewRepository {
  findUserReviews(id: number): Promise<Review[]>;
}
@injectable()
class ReviewRepository implements IReviewRepository {
  async findUserReviews(id: number) {
    const user = await prisma.user.findOne({
      where: { id },
    });
    if (!user)
      throw new AppError('User with provided id not found', false, 404);
    const reviews = await prisma.review.findMany({
      where: {
        user,
      },
      include: {
        book: true,
      },
    });
    return reviews;
  }
}
export default ReviewRepository;
