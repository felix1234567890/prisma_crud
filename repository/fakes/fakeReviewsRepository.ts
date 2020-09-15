import { Review } from '@prisma/client';
import { IReviewRepository } from 'repository/review.repository';

class FakeReviewsRepository implements IReviewRepository {
  findUserReviews(id: number): Promise<Review[]> {
    throw new Error('Method not implemented.');
  }
}
export default FakeReviewsRepository;
