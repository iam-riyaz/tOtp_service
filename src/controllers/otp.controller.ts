
import speakeasy from "speakeasy"
import {Request,Response} from "express"
import * as otpServices from "../services/otp.services"


export const createOtp= async (req:Request,res:Response)=>{
    try{
        const {email,phone}=req.body;

        const secretKey= speakeasy.generateSecret({length:20}) 
        console.log(secretKey)
        const otp= speakeasy.totp({
            secret:secretKey.base32,
            encoding:"base32"
        })

        const otpData = await otpServices.createOtp({email,phone})
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
        window:1
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