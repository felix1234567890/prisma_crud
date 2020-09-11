import { validate } from 'class-validator';
import AppError from './AppError';

const validateClassParameters = async (object: any): Promise<void> => {
  const errors = await validate(object, { validationError: { target: false } });

  if (errors.length > 0) {
    const errorDetails = errors.map((error) => ({
      property: error.property,
      value: error.value,
      constraints: error.constraints,
    }));

    throw new AppError('Invalid parameters', false, 400, errorDetails);
  }
};

export default validateClassParameters;
