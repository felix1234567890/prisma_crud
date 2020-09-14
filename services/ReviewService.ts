import { injectable, inject } from 'tsyringe';
import { IReviewRepository } from 'repository/review.repository';

@injectable()
class RewiewService {
  constructor(
    @inject('ReviewRepository')
    private readonly reviewRepository: IReviewRepository,
  ) {}
}
export default RewiewService;
