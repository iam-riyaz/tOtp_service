import  express  from "express";
import dotenv from "dotenv";
import  {otpRouter} from "./routes/otp.Route"
import { connectDB } from "./config/db";

dotenv.config()


const app = express();

const port= process.env.PORT || 2000

app.use(express.json())

app.use("/otp",otpRouter)

connectDB().then(()=>{
    
    app.listen(port,()=>{
        console.log(`listioning on port ${port}`)
    })


})



