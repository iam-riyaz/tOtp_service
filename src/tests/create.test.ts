import {describe, expect, test} from '@jest/globals';
// import { request, Request ,Response} from 'express';
import request  from "supertest"

import supertest from "supertest"
import { otpRouter } from '../routes/otp.Route';

// import { createOtp } from '../controllers/otp.controller';
 


describe("Test the root path", () => {
    test("It should response the GET method", done => {
      request(otpRouter)
        .get("/createOtp")
        .then(response => {
          expect(response.status).toBe(200);
          done();
        });
    });
  });