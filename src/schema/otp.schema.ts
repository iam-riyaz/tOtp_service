import mongoose from "mongoose";
import {IOtp} from "../models/otp.model";

const TotpSchema= new mongoose.Schema<IOtp>({
    email: {type: "string", required: true},
    phone: {type: "number", required: true},
    secret:{type: "string", required: false},
    expireAt: { type: Date, default:Date.now },
    createdAt: { type: Date, default:Date.now}
})

export const Totp=mongoose.model<IOtp>('otps', TotpSchema)