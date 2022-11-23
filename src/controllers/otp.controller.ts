import speakeasy from "speakeasy";
import { Request, response, Response } from "express";
import * as otpServices from "../services/otp.services";
import { mailSenderFunction } from "../config/mail";
import express from "express";
import qrcode from "qrcode";
import { ITempUserData } from "../models/tempUserData.model";


//controller to create secret key for otp services and send an OTP to provided email address
export const createOtp = async (req: Request, res: Response) => {
  try {
    const { email, phone } = req.body;
    const secretKeyObj = speakeasy.generateSecret({ length: 20 });

    const secretKey = secretKeyObj.base32;

    const otp = speakeasy.totp({
      secret: secretKey,
      encoding: "base32",
      step: 30,
    });

    const url = secretKeyObj.otpauth_url || "";

    // method to  Create QR code URL and send response
    qrcode.toDataURL(url, function (err, data_url) {
      res.status(200).send(`<h1>this the QR code for secret</h1>
                <img src="${data_url}">
                <h3>if unable to scan the QR code enter KEY <h2>${secretKey}</h2> </h3>`);
    });

    // Email sending otptions
    const mailOptionsSender = {
      to: email,
      subject: `OTP for email verification ${email}`,
      otp: `your OTP is: ${otp} and valid for 60 seconds only`,
    };
    // mailSenderFunction(mailOptionsSender);

    const tempUserData = await otpServices.createOtp({
      email,
      phone,
      secretKey,
    });

    // res.status(200).send({tempUserData,otp})
  } catch {
    res.status(400).send("this is an error in creating OTP");
  }
};

// controller to validate OTP
export const validateOtp = async (req: Request, res: Response) => {
  try {
          const email= req.body.email
          
    const tempUserData= await otpServices.validateOtp({email})



    console.log({tempUserData});
    const secretKey= tempUserData?.secretKey || ""

    if(tempUserData?.flag===true){
          res.status(400).send("you can use OTP's only one time, this otp is already use")
          return;
    }
    
    const valid = speakeasy.totp.verify({
      secret: secretKey,
      encoding: "base32",
      token: req.body.otp,
      window: 0,
    });

    if(!valid){
      res.status(200).send("your OTP is Wrong")
      return;
    }


    
    if(valid){
      const email=tempUserData?.email ||""
      const flag=true;
           const updateFlag= otpServices.updateFlag(email,flag)





      res.status(200).send("your OTP verification is successful")
      return
    }

    else{
      res.status(200).send("your OTP in not valid");
      return
    }

   
  } catch {
    res.status(400).send("error in validatation OTP");
  }
};

export const resendOtp = async (req: Response, res: Response) => {
  try {
  } catch {}
};
