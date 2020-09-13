import { prisma } from 'index';
import { Profile } from '@prisma/client';
import { UploadedFile } from 'express-fileupload';

export interface IProfileRepository {
  createProfile(userId: number, profileImage: UploadedFile): Promise<Profile>;
  getProfiles(): Promise<Profile[]>;
  deleteProfile(id: number): Promise<Profile>;
  findProfileById(id: number): Promise<Profile | null>;
}
export default class ProfileRepository implements IProfileRepository {
  public async createProfile(
    userId: number,
    profileImage: UploadedFile,
  ): Promise<Profile> {
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

  public async getProfiles() {
    const profiles = await prisma.profile.findMany({
      include: {
        user: true,
      },
    });
    return profiles;
  }

  public async deleteProfile(id: number) {
    const profile = await prisma.profile.delete({
      where: { id },
    });
    return profile;
  }

  public async findProfileById(id: number) {
    const profile = await prisma.profile.findOne({
      where: { id },
    });
    return profile;
  }
}
