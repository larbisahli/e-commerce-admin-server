import { EmailTemplate } from '../templates/EmailTemplate';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailType {
  email: string;
  url: string;
}

export const sendConfirmationEmail: ({
  email,
  url,
}: EmailType) => Promise<void> = async ({ email, url }) => {
  await sgMail
    .send({
      to: email,
      from: 'dropgala@gmail.com',
      subject: 'Confirmation Email',
      // text: 'Easy to do anywhere, even with Node.js',
      html: EmailTemplate({ url, email }),
    })
    .then(() => {
      console.log('Email sent');
    })
    .catch((error: Error) => {
      console.error(error);
    });
};
