
import speakeasy from "speakeasy"
import {Request,Response} from "express"
export const createOtp= async (req:Request,res:Response)=>{
    try{
        // const {email,phone}=req.body;

        const secretKey= speakeasy.generateSecret({length:20})

        res.send({"secretKey":secretKey.base32})
       console.log(secretKey)
    }
    catch{
        res.send("this isn an error")
    }
}