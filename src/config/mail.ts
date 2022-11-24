import nodemailer from "nodemailer";
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "riyazahma.online@gmail.com",
    pass: "",
  },
});

export interface mailOptionsSenderType {
  to: string;
  subject: string;
  otp: string;
}

export const mailSenderFunction = async (
  mailOptionsSender: mailOptionsSenderType
) => {
  await transporter.sendMail({
    to: mailOptionsSender.to,
    subject: mailOptionsSender.subject,
    text: mailOptionsSender.otp,
  });
};
