import { IOtp } from "../models/otp.model";
import { Totp } from "../schema/otp.schema";


export const createOtp=(otpData:IOtp)=>{
    const UserOTP =new Totp({...otpData,expireAt:Date.now()+1000*60*30})
    return UserOTP.save()
}