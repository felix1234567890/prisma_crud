import nodemailer, { Transporter } from 'nodemailer';
import { injectable } from 'tsyringe';
import AppError from './AppError';
interface MailData {
  from: string;
  to: string;
  subject: string;
  text: string;
}
export interface IMailService {
  sendMail(data: MailData): Promise<void>;
}
@injectable()
class MailService implements IMailService {
  private transporter: Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: 'blueskyandsea01@gmail.com',
        pass: 'baltazar10baltazar10',
      },
    });
  }
  async sendMail(data: MailData) {
    try {
      await this.transporter.sendMail(data);
    } catch (error) {
      throw new AppError(error.message);
    }
  }
}
export default new MailService();
