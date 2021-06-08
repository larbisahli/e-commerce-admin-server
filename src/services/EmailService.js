import { EmailTemplate } from '../templates/EmailTemplate';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendConfirmationEmail = async ({ email, url }) => {
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
    .catch((error) => {
      console.error(error);
    });
};
