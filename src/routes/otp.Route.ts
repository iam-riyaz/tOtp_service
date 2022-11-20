import express from 'express';
import * as otpController from "../controllers/otp.controller"



export const otpRouter=express.Router()

otpRouter.post("/otpCreate",otpController.createOtp)
otpRouter.post("/otpValidate",otpController.validateOtp)