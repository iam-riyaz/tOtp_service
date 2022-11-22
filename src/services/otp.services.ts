import { ITempUserData } from "../models/tempUserData.model";
import { IUserData } from "../models/UserData.model";
import { TempUserDataMongo } from "../schema/tempUserData.schema";
import { UserDataMongo } from "../schema/UserData.schema";


export const createOtp= async (tempUserData:ITempUserData)=>{
    const {email}= tempUserData
    const existOrNot = await TempUserDataMongo.findOne({email})

    if(existOrNot){
          await TempUserDataMongo.findByIdAndDelete(existOrNot._id)
    }

    const tempData = new TempUserDataMongo({...tempUserData,expireAt:Date.now()+1000*60*30})
    return tempData.save()
}


export const validateOtp= async(userData:IUserData)=>{

    const data= new UserDataMongo({...userData})
    return data.save()

}