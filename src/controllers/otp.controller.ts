
import speakeasy from "speakeasy"
import {Request,Response} from "express"
import * as otpServices from "../services/otp.services"
import { mailSenderFunction } from "../config/mail";

import qrcode from "qrcode";


export const createOtp= async (req:Request,res:Response)=>{
    try{
        const {email,phone}=req.body;

        const secretKey= speakeasy.generateSecret({length:20}) 
        console.log(secretKey)
        const otp= speakeasy.totp({
            secret:secretKey.base32,
            encoding:"base32",
            step:45
        })
const url= secretKey.otpauth_url || ""
        qrcode.toDataURL(url, function(err, data_url) {
            console.log("the  QR code url: ",data_url);
           
            // Display this data URL to the user in an <img> tag
            // Example:
        

          })

        const mailOptionsSender = {
            to: email,
            subject: `OTP for email verification ${email}`,
            otp:`your OTP is: ${otp}`
          };
      
          
          mailSenderFunction(mailOptionsSender);

        // const otpData = await otpServices.createOtp({email,phone})
        res.send({"otp":otp,"secret":secretKey.base32})

       console.log(secretKey)
    }
    catch{
        res.send("this is an error")
    }
}

export const validateOtp= async (req:Request,res:Response)=>{

    try{
       const valid= speakeasy.totp.verify({
        secret:req.body.secretKey,
        encoding:"base32",
        token:req.body.otp,
        window:0
       })
       console.log(req.body.secretKey,req.body.otp)
       res.send({valid})

    }
    catch{
      res.send("error in validatation otp")
    }
}


export const resendOtp= async(req:Response,res:Response)=>{

    try{

    }
    catch{
        
    }


}