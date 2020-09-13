import { UploadedFile } from 'express-fileupload';
import path from 'path';
import { unlink } from 'fs/promises';
import { Profile } from '@prisma/client';

export interface IIMageUploader {
  saveImageToDirectory(profileImage: UploadedFile): void;
  deleteImageFromDirectory(profile: Profile): Promise<void>;
}

class ImageUploader implements IIMageUploader {
  basePath: string;
  constructor() {
    this.basePath = `${process.cwd()}/public/profileImages`;
  }

  saveImageToDirectory(profileImage: UploadedFile): void {
    return profileImage.mv(
      path.join(`${this.basePath}/${profileImage.name}`),
      async (err) => {
        if (err) throw new Error(err.message);
      },
    );
  }

  async deleteImageFromDirectory(profile: Profile): Promise<void> {
    return await unlink(
      path.join(`${this.basePath}/${profile.filename.split('-')[0]}`),
    );
  }
}
export default new ImageUploader();
