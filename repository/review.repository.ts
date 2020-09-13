import { injectable } from 'tsyringe';
import { prisma } from 'index';
import { Review } from '@prisma/client';
import AppError from 'utils/AppError';

export interface IReviewRepository {
  findUserReviews(id: number): Promise<Review[]>;
  // createReview(): Promise<Review>;
  // // updateReview(): Promise<Review>;
  // getReviews(): Promise<Review[]>;
  // getReviewById(): Promise<{ user: User; book: Book; text: string } | null>;
}

@injectable()
class ReviewRepository {
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
  // public async createReview() {
  //   const review = await prisma.review.create({
  //     data: {
  //       user: {
  //         connect: {
  //           id: +id,
  //         },
  //       },
  //       book: {
  //         connect: {
  //           id: bookId,
  //         },
  //       },
  //       text: text,
  //     },
  //   });
  //   return review;
  // }
  // // public async updateReview() {
  // //   const review = await prisma.review.update({
  // //     where: {
  // //       id: +req.params.id,
  // //     },
  // //     data: {
  // //       text: req.body.text,
  // //       user:requestAnimationFrame.user
  // //     },
  // //   });
  // //   return review;
  // // }
  // public async getReviews() {
  //   const reviews = await prisma.review.findMany({
  //     include: {
  //       user: true,
  //       book: true,
  //     },
  //   });
  //   return reviews;
  // }
  // public async getReviewById() {
  //   const review = await prisma.review.findOne({
  //     where: {
  //       userId_bookId: {
  //         bookId: +req.params.id,
  //         userId: +req.user.id,
  //       },
  //     },
  //     select: { user: true, book: true, text: true },
  //   });
  //   return review;
  // }
}
export default ReviewRepository;
