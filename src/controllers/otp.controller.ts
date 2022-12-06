import speakeasy from "speakeasy";
import { Request, Response } from "express";
import * as otpServices from "../services/otp.services";
import qrcode from "qrcode";

import crypto from "crypto";


// ----------------------------------------------------------------
// globle valiables for storing the data

let myData=[{data:"riyaz ahmad",expireAt:Math.floor((Date.now())+60000)}]

// let milliSecond=myData[0].expireAt
// let dateObj= new Date(milliSecond)
// console.log(dateObj.toLocaleDateString()+" "+dateObj.toLocaleTimeString())

for(let i=0; i<myData.length; i++){
  if(myData[i].expireAt<=Date.now()){
    myData=myData.splice(i,i)
  }
}


// ----------------------------------------------------------------








// ----------------------------------------------------------------
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(text:any) {
 let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
 let encrypted = cipher.update(text);
 encrypted = Buffer.concat([encrypted, cipher.final()]);
 return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(text:any) {
 let iv = Buffer.from(text.iv, 'hex');
 let encryptedText = Buffer.from(text.encryptedData, 'hex');
 let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
 let decrypted = decipher.update(encryptedText);
 decrypted = Buffer.concat([decrypted, decipher.final()]);
 return decrypted.toString();
}

const enct= encrypt("1")
const enct2= enct.iv
console.log({enct});

console.log("real msg:",decrypt(enct));















// ----------------------------------------------------------------










// controller to create secret key and send/resend otp to provided email address and responsding QR code URL 
export const createOtp = async (req: Request, res: Response) => {
 
  try {
    const { email, phone } = req.body;
    
    const ifEmailExists = await otpServices.ifEmailExists(email);

    if (!ifEmailExists) {

      // generating secret key
      const secretKeyObj = speakeasy.generateSecret({ length: 20 });

      const secretKey = secretKeyObj.base32;
      const otpauth_url = secretKeyObj.otpauth_url;
      console.info("secretKey is generated:", Date.now());

      // otp Generater
      const otp = speakeasy.totp({
        secret: secretKey,
        encoding: "base32",
        step: 60,
      });


      // Email sending otptions
      const mailOptionsSender = {
        to: email,
        subject: `OTP for email verification ${email}`,
        otp: `your OTP is: ${otp} and valid for 30 seconds only`,
      };
      

      // saving data in Mongo database
      await otpServices.createOtp({
        email,
        phone,
        secretKey,
        otpauth_url,
      });

      // method to  Create QR code URL and send response
      const url = secretKeyObj.otpauth_url || "";

      qrcode.toDataURL(url, function (err, data_url) {
        if (err) {
          res.status(422).send({
            success: false,
            statusCode: 422,
            TraceID: Date.now(),
            Message: "Unable to generate QR code URL and sending mail ",
            path: "http://localhost:2000/v1/otp/createOtp",
          });
          return;
        }


        // mailSenderFunction(mailOptionsSender); //email sending function
        console.info("OTP sent to Email:", Date.now());

        res.status(201).send({
          success: true,
          statusCode: 200,
          TraceID: Date.now(),
          Message:
            "OTP is successfully sent to provided Email/phone and QR code generated",
          qrCodeUrl: data_url,
        });
        console.info("statusCode 201 and QR code url send:", Date.now());
        return;
      });
      return;
    }

    else{

    
    // extract userData form Database
    const userData = await otpServices.validateOtp(email);


    const userSecretKey = userData?.secretKey || "";

    // otp Generater
    const otp = speakeasy.totp({
      secret: userSecretKey,
      encoding: "base32",
      step: 30,
    });

    // Email sending otptions
    const mailOptionsSender = {
      to: email,
      subject: `OTP for email verification ${email}`,
      otp: `your OTP is: ${otp} and valid for 30 seconds only`,
    };

    // method to  Create QR code URL and send response
    const url = userData?.otpauth_url || "";

    qrcode.toDataURL(url, function (err, data_url) {
      if (err) {
        res.status(422).send({
          success: false,
          statusCode: 422,
          TraceID: Date.now(),
          Message: "Unable to generate QR code URL and sending mail ",
          path: "http://localhost:2000/v1/otp/createOtp",
        });
        return;
      }


    
      // mailSenderFunction(mailOptionsSender); //email sending function
      console.info("OTP sent to Email:", Date.now());

      res.status(200).send({
        success: true,
        statusCode: 200,
        TraceID: Date.now(),
        Message:
          "User email already exist, OTP is successfully resend to provided Email/phone and QR code generated",
        qrCodeUrl: data_url,
      });
      console.info("statusCode 200 and QR code url send:", Date.now());
    })};
  } catch {
    res.status(400).send({
      success: false,
      statusCode: 400,
      TraceID: Date.now(),
      Message: "bad request somethisng went wrong. Please try again",
      path: "http://localhost:2000/v1/otp/createOtp",
    });
  }
};

// controller to validate OTP
export const validateOtp = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;

    // to Extract the secretKey form database 
    const tempUserData = await otpServices.validateOtp(email);
    const secretKey = tempUserData?.secretKey || "";

    console.info("get secretKey form database for verification:", Date.now());

    // otp validation method using speakeasy
    const valid = speakeasy.totp.verify({
      secret: secretKey,
      encoding: "base32",
      token: req.body.otp,
      window: 0,
    });
    console.info("otp verification prosess done :", Date.now());

    // if not valid then directly return invalid OTP
    if (!valid) {
      res.status(401).send({
        success: false,
        statusCode: 401,
        TraceID: Date.now(),
        Message: "Invalid OTP Entered, not verified",
        path: "http://localhost:2000/v1/otp/validateOtp",
      });
      return;
    }

  
    // otp is valid but need to check if user already validate , 
    // if already verified than return already verified can not verify again
    const check = await otpServices.checkFlag(email);
    if (check?.flag === true) {
      res.status(409).send({
        success: false,
        statusCode: 409,
        TraceID: Date.now(),
        Message: "OTP already verified , can not be verified again",
        path: "http://localhost:2000/v1/otp/validateOtp",
      });
      return;
    }
    

    // otp is valid and also user never been verified then updateFlag 
    // that it is verified now and return successfully verified
    const flag = true;
    await otpServices.updateFlag(email, flag);

    res.status(200).send({
      success: true,
      StatusCode: 200,
      TraceID: Date.now(),
      Message: "OTP verified successfully",
    });

    console.info("otp verified successfully:", Date.now());
    return;
  } catch {
    res.status(400).send({
      success: false,
      statusCode: 400,
      TraceID: Date.now(),
      Message: "bad request, Error at validation of OTP",
      path: "http://localhost:2000/v1/otp/createOtp",
    });
  }
};


