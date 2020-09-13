import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../index';
import isAuthenticated from '../utils/isAuthenticated';
import { UploadedFile } from 'express-fileupload';
import path from 'path';
import { PrismaClientKnownRequestError } from '@prisma/client';

const router = Router();

router.post(
  '/',
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user;
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No profile picture uploaded');
    }
    const profileImage = req.files.file as UploadedFile;
    if (!profileImage.mimetype.startsWith('image')) {
      return res.status(400).json({ error: 'Only images allowed' });
    }

    profileImage.mv(
      path.join(`${process.cwd()}/public/profileImages/${profileImage.name}`),
      async function (err) {
        if (err) return res.status(500).send(err.message);

        try {
          const profile = await prisma.profile.create({
            data: {
              filename: `${profileImage.name}-${profileImage.md5}`,
              user: {
                connect: {
                  id: +id,
                },
              },
            },
          });
          res.status(200).json(profile);
        } catch (error) {
          if (error instanceof PrismaClientKnownRequestError) {
            res.status(500).json({ error: 'You already have profile' });
          }
        }
      },
    );
  },
);
router.get('/', async (req: Request, res: Response) => {
  const profiles = await prisma.profile.findMany({
    include: {
      user: true,
    },
  });
  res.status(200).send(profiles);
});
router.delete('/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const profile = await prisma.profile.findOne({
      where: {
        id: +req.params.id,
      },
    });
    if (!profile) return res.status(404).json({ error: 'Not found' });
    if (profile.userId !== +req.user.id) {
      return res.status(403).json({ error: 'Not allowed' });
    }
    res.status(200).send(profile);
  } catch (error) {
    console.log(error);
  }
});
export default router;
