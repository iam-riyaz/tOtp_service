import mongoose from "mongoose";
import {IOtp} from "../models/otp.model";

const TotpSchema= new mongoose.Schema<IOtp>({
    createdAt: {type: "string"},
    email: {type: "string", required: true},
    phone: {type: "number", required: true},
    secret:{type: "string", required: false}
},{expireAfterSeconds:20})

export const Totp=mongoose.model<IOtp>('otps', TotpSchema)