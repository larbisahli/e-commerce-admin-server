
interface EmailType {
  email: string;
  url: string;
}
export const EmailTemplate: ({url, email}:EmailType) => string = ({ url, email }) => {
  return `${url}-${email}`;
};
