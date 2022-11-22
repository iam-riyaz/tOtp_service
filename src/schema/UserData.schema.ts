import mongoose from "mongoose";
import {ITempUserData} from "../models/tempUserData.model";
import { IUserData } from "../models/UserData.model";

const TotpSchema= new mongoose.Schema<ITempUserData>({
    email: {type: "string", required: true},
    phone: {type: "number", required: true},
    secretKey:{type: "string", required: false},
    createdAt: { type: Date, default:Date.now}
})

export const UserDataMongo=mongoose.model<IUserData>('userData', TotpSchema)