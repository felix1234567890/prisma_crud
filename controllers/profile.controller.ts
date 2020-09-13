import { injectable } from 'tsyringe';
import ProfileService from 'services/ProfileService';
import { Request, Response } from 'express';
import AppError from 'utils/AppError';
import { UploadedFile } from 'express-fileupload';
import { DeleteProfileDTO } from 'dtos/profile';
import { plainToClass } from 'class-transformer';

@injectable()
class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  public createProfile = async (req: Request, res: Response) => {
    const { id } = req.user;
    if (!req.files || Object.keys(req.files).length === 0) {
      throw new AppError('No profile picture uploaded', false, 403);
    }
    const profileImage = req.files.file as UploadedFile;
    if (!profileImage.mimetype.startsWith('image')) {
      return res.status(400).json({ error: 'Only images allowed' });
    }
    const profile = await this.profileService.createProfile(id, profileImage);
    res.status(200).send(profile);
  };

  public getProfiles = async (req: Request, res: Response) => {
    const profiles = await this.profileService.getAllProfiles();
    res.status(200).send(profiles);
  };

  public deleteProfile = async (req: Request, res: Response) => {
    const profileDto = plainToClass(DeleteProfileDTO, {
      ...req.params,
      ...req.user,
    });
    const profile = await this.profileService.deleteProfile(profileDto);
    res.status(200).send(profile);
  };
}
export default ProfileController;
