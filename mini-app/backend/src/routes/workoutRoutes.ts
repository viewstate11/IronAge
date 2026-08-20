import {Router} from "express";

import {prisma} from "../prisma";


const router = Router();



router.post("/",async(req,res)=>{


try{


const workout = await prisma.workout.create({

data:req.body

});


res.json(workout);



}catch(error){


res.status(500).json({

message:"Workout error"

});


}


});




router.get("/:userId",async(req,res)=>{


const workouts = await prisma.workout.findMany({

where:{

userId:Number(req.params.userId)

}

});



res.json(workouts);


});



export default router;