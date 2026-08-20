// IRONAGE Backend Server ⚔️


import express from "express";

import cors from "cors";

import dotenv from "dotenv";


// Routes

import userRoutes from "./routes/userRoutes";

import workoutRoutes from "./routes/workoutRoutes";

import progressRoutes from "./routes/progressRoutes";

import premiumRoutes from "./routes/premiumRoutes";





dotenv.config();





const app = express();




// Middleware

app.use(cors());

app.use(express.json());







// Test Route

app.get("/", (_req, res)=>{


console.log("IRONAGE HOME REQUEST");


res.status(200).json({

message:"IRONAGE API ONLINE ⚔️",

status:"running"

});


});







// API Routes


app.use(

"/api/users",

userRoutes

);



app.use(

"/api/workouts",

workoutRoutes

);



app.use(

"/api/progress",

progressRoutes

);



app.use(

"/api/premium",

premiumRoutes

);







// Error Handler


app.use(

(err:any, _req:express.Request, res:express.Response, _next:express.NextFunction)=>{


console.error("SERVER ERROR:", err);



res.status(500).json({

message:"IRONAGE SERVER ERROR"

});


}

);








const PORT = Number(process.env.PORT) || 5000;







app.listen(

PORT,

"0.0.0.0",

()=>{


console.log(

`⚔️ IRONAGE SERVER RUNNING ON PORT ${PORT}`

);


}

); 