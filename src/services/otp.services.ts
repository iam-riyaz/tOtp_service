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

    const tempData = new TempUserDataMongo({...tempUserData,expireAt:Date.now()+1000*60*5})
    return tempData.save()
}


export const validateOtp= async(userData:IUserData)=>{

    const {email}=userData
   console.log(email)
   const data= await TempUserDataMongo.findOne({email})

//    const _id=data?._id || ""

//    const updateFlag = await TempUserDataMongo.findByIdAndUpdate(_id,{flag},{new:true})

   return data

}

export const checkFlag= async (email:string)=>{
    const check= await TempUserDataMongo.findOne({email})

    return check
}

export const updateFlag = async (email:string,flag:boolean)=>{
    
   const updateFlag = await TempUserDataMongo.findOneAndUpdate({email},{flag},{new:true})
   return updateFlag
}


export const resendOtp= async (email:string)=>{

  
    const resendOtp = await TempUserDataMongo.findOne({email})

    if(!resendOtp){
        return false
    }

    const resendSecret= resendOtp?.secretKey

    return resendSecret

}