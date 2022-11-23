import { ITempUserData } from "../models/tempUserData.model";

import { TempUserDataMongo } from "../schema/tempUserData.schema";


export const createOtp = async (tempUserData: ITempUserData) => {
  const { email } = tempUserData;
  const existOrNot = await TempUserDataMongo.findOne({ email });

  if (existOrNot) {
    await TempUserDataMongo.findByIdAndDelete(existOrNot._id);
  }

  const tempData = new TempUserDataMongo({
    ...tempUserData,
    expireAt: Date.now() + 1000 * 60 * 30,
  });
  return tempData.save();
};

export const validateOtp = async (email: string) => {
  const data = await TempUserDataMongo.findOne({ email });

  return data;
};

export const checkFlag = async (email: string) => {
  const check = await TempUserDataMongo.findOne({ email });

  return check;
};

export const updateFlag = async (email: string, flag: boolean) => {
  const updateFlag = await TempUserDataMongo.findOneAndUpdate(
    { email },
    { flag },
    { new: true }
  );
  return updateFlag;
};

export const resendOtp = async (email: string) => {
  const resendOtp = await TempUserDataMongo.findOne({ email });

  if (!resendOtp) {
    return false;
  }

  const resendSecret = resendOtp?.secretKey;

  return resendSecret;
};
