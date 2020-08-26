import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { prisma } from "../index";

export const validationRules = () => [
  check("username")
    .isLength({ min: 3 })
    .withMessage("Username should contain at least 3 letters"),
  check("email")
    .isEmail()
    .withMessage("THis is not valid email")
    .custom(async (value) => {
      const existingUser = await prisma.user.findOne({
        where: { email: value },
      });
      if (existingUser) {
        return Promise.reject("User with this email already exists");
      }
    }),
  check("password").isLength({ min: 4 }).matches(/\d/),
  check("married").optional().isBoolean(),
];
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors: Array<{ [key: string]: string }> = [];
  errors.array().map((err) => {
    console.log(err);
    extractedErrors.push({ [err.param]: err.msg });
  });
  return res.status(422).json({
    errors: extractedErrors,
  });
};
