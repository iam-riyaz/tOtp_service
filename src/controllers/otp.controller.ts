import speakeasy from "speakeasy";
import { Request,  Response } from "express";
import * as otpServices from "../services/otp.services";
import { mailSenderFunction } from "../config/mail";
import qrcode from "qrcode";


//controller to create secret key for otp services and send an OTP to provided email address
export const createOtp = async (req: Request, res: Response) => {
  try {
    const { email, phone } = req.body;
    const secretKeyObj = speakeasy.generateSecret({ length: 20 });

    const secretKey = secretKeyObj.base32;


    // otp Generater
    const otp = speakeasy.totp({
      secret: secretKey,
      encoding: "base32",
      step: 30,
    });


      // method to  Create QR code URL and send response
    const url = secretKeyObj.otpauth_url || "";
   
    qrcode.toDataURL(url, function (err, data_url) {
      res.status(200).send(`
      <h5>OTP is successfully sent to Email: ${email}</h5>
      <h2>OR</h2>
      <h3>Scan QR code to get OTP</h3>
                <img src="${data_url}">`);
    });

    // Email sending otptions
    const mailOptionsSender = {
      to: email,
      subject: `OTP for email verification ${email}`,
      otp: `your OTP is: ${otp} and valid for 60 seconds only`,
    };
    mailSenderFunction(mailOptionsSender); //email sending function

    const tempUserData = await otpServices.createOtp({
      email,
      phone,
      secretKey,
    });
  } catch {
    res.status(400).send("this is an error in creating OTP");
  }
};

// controller to validate OTP
export const validateOtp = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;

    const tempUserData = await otpServices.validateOtp({ email });

    console.log({ tempUserData });
    const secretKey = tempUserData?.secretKey || "";

    const valid = speakeasy.totp.verify({
      secret: secretKey,
      encoding: "base32",
      token: req.body.otp,
      window: 0,
    });

    if (!valid) {
      res.status(200).send("your OTP is Wrong");
      return;
    }

    if (valid) {
      const email = tempUserData?.email || "";
      const check = await otpServices.checkFlag(email);
      if (check?.flag === true) {
        res.status(200).send("your OTP is already used not valid anymore");
        return;
      }

      const flag = true;
      const updateFlag = otpServices.updateFlag(email, flag);

      res.status(200).send("your OTP verification is successful");
      return;
    } else {
      res.status(200).send("your OTP in not valid");
      return;
    }
  } catch {
    res.status(400).send("error in validatation OTP");
  }
};

// controller to resend OTP
export const resendOtp = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;

    const secretFinder = (await otpServices.resendOtp(email)) || "";

    const otp = speakeasy.totp({
      secret: secretFinder,
      encoding: "base32",
      step: 30,
    });

    if(!secretFinder){
      res.status(404).send("User not exist in DB can not Resend OTP")
      return
    }

    // Email sending otptions
    const mailOptionsSender = {
      to: email,
      subject: `OTP for email verification ${email}`,
      otp: `your OTP is: ${otp} and valid for 30 seconds only`,
    };
    mailSenderFunction(mailOptionsSender);



    res.status(200).send("otp is successfully resent to your email address");
  } catch {
    res.status(400).send("error in resending OTP");
  }
};
