import { prisma } from 'index';
import { Profile } from '@prisma/client';
import { UploadedFile } from 'express-fileupload';
import { IBaseRepository } from './base.repository';

type CreateProfileDTO = {
  userId: number;
  profileImage: UploadedFile;
};
export interface IProfileRepository
  extends Omit<IBaseRepository<CreateProfileDTO, Profile>, 'update'> {}

export default class ProfileRepository implements IProfileRepository {
  public async create({
    profileImage,
    userId,
  }: CreateProfileDTO): Promise<Profile> {
    const profile = await prisma.profile.create({
      data: {
        filename: `${profileImage.name}-${profileImage.md5}`,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return profile;
  }

  public async getAll() {
    const profiles = await prisma.profile.findMany({
      include: {
        user: true,
      },
    });
    return profiles;
  }

  public async delete(id: number) {
    const profile = await prisma.profile.delete({
      where: { id },
    });
    return profile;
  }

  public async findById(id: number) {
    const profile = await prisma.profile.findUnique({
      where: { id },
    });
    return profile;
  }
}
