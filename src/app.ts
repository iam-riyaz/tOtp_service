import  express  from "express";
import dotenv from "dotenv";
import  {otpRouter} from "./routes/otp.Route"

dotenv.config()


const app = express();

const port= process.env.PORT

app.use(express.json())

app.use("/otp",otpRouter)

app.listen(port,()=>{
    console.log(`listioning on port ${port}`)
})

