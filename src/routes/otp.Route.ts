import express from 'express';
import * as otpController from "../controllers/otp.controller"



export const otpRouter=express.Router()

otpRouter.post("/createOtp",otpController.createOtp)
otpRouter.post("/validateOtp",otpController.validateOtp)
otpRouter.post("/resendOtp",otpController.resendOtp)