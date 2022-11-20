import mongoose from "mongoose";
import {IOtp} from "../models/otp.model";

const TotpSchema= new mongoose.Schema<IOtp>({
    email: {type: "string", required: true},
    phone: {type: "number", required: true}
})

export const Totp=mongoose.model<IOtp>('otps', TotpSchema)