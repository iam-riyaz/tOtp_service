import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS
    }
});



export interface mailOptionsSenderType {
    to: string;
    subject: string;
    otp:string
    
  }

  export const mailSenderFunction = async (mailOptionsSender:mailOptionsSenderType) => {
    await transporter.sendMail({
      
      to: mailOptionsSender.to,
      subject: mailOptionsSender.subject,
      text:mailOptionsSender.otp
      
    });
  };