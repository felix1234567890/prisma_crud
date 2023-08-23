import { IProfileRepository } from 'repository/profile.repository';
import { inject, injectable } from 'tsyringe';
import { UploadedFile } from 'express-fileupload';
import AppError from 'utils/AppError';
import { Prisma } from '@prisma/client';
import { DeleteProfileDTO } from 'dtos/profile';
import { IIMageUploader } from 'utils/ImageUploader';

@injectable()
class ProfileService {
  constructor(
    @inject('ProfileRepository')
    private readonly profileRepository: IProfileRepository,
    @inject('ImageUploadService')
    private readonly imageUploadService: IIMageUploader,
  ) {}

  public async createProfile(id: string, profileImage: UploadedFile) {
    if (!profileImage.mimetype.startsWith('image')) {
      throw new AppError('Only images are allowed', false, 403);
    }
    this.imageUploadService.saveImageToDirectory(profileImage);
    try {
      const profile = await this.profileRepository.create({
        userId: parseInt(id),
        profileImage,
      });
      return profile;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new AppError('You already have profile');
      }
    }
  }

  public async getAllProfiles() {
    const profiles = await this.profileRepository.getAll();
    return profiles;
  }

  public async deleteProfile({ profileId, id }: DeleteProfileDTO) {
    const profile = await this.profileRepository.findById(profileId);
    if (!profile) throw new AppError('Profile not found', false, 404);
    if (profile.userId !== id)
      throw new AppError('You cannot delete profile that you don\t own');
    await this.imageUploadService.deleteImageFromDirectory(profile);
    await this.profileRepository.delete(profileId);
    return profile;
  }
}
export default ProfileService;
