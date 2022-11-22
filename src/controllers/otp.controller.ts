import speakeasy from "speakeasy";
import { Request, Response } from "express";
import * as otpServices from "../services/otp.services";
import { mailSenderFunction } from "../config/mail";
import express from "express";
import qrcode from "qrcode";


//controller to create secret key for otp services and send an OTP to provided email address 
export const createOtp = async (req: Request, res: Response) => {
  try {
    const { email, phone } = req.body;
    const secretKeyObj = speakeasy.generateSecret({ length: 20 });

    const secretKey = secretKeyObj.base32;

    const otp = speakeasy.totp({
      secret: secretKey,
      encoding: "base32",
      step:30
    });

    const url = secretKeyObj.otpauth_url || "";

    // Create QR code URL
    qrcode.toDataURL(url, function (err, data_url) {
      res.send(`<h1>this the QR code for secret</h1>
                <img src="${data_url}">
                <h3>if unable to scan the QR code enter KEY <h2>${secretKey}</h2> </h3>`);
    });

    // Email sending otptions
    const mailOptionsSender = {
      to: email,
      subject: `OTP for email verification ${email}`,
      otp: `your OTP is: ${otp} and valid for 60 seconds only`,
    };
    mailSenderFunction(mailOptionsSender);

    const tempUserData = await otpServices.createOtp({ email, phone,secretKey }) ;

    // res.send({tempUserData,otp})
  } 
  catch
   {
    res.send("this is an error");
   }
};


// controller to validate OTP 
export const validateOtp = async (req: Request, res: Response) => {
  try {
    console.log(req.body.secret,req.body.otp)
    const valid = speakeasy.totp.verify({
      secret: req.body.secretKey,
      encoding: "base32",
      token: req.body.otp,
      window: 0,
    });

    
   
    res.send( {valid} );
  } catch {
    res.send("error in validatation otp");
  }
};

export const resendOtp = async (req: Response, res: Response) => {
  try {

    

  } 
  catch 
  {

  }
};
