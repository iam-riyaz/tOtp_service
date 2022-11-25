// import { descrbe, expect, it, test } from "@jest/globals";
import { response } from "express";
import request from "superagent";
import supertest from "supertest";
import  {createServer} from "../utils/server"

const app= createServer()

describe("Test the root path", () => {
   
    it("should return test output", async()=>{
         await supertest(app).post("/v1/otp/createOtp").send({email:"riyaz.on@int.com",phone:765534}).expect(400)
    })
    
  });