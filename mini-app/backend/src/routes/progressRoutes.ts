import {Router} from "express";

import {prisma} from "../prisma";


const router = Router();



// CREATE PROGRESS

router.post("/", async(req,res)=>{


try{


const progress = await prisma.progress.create({

data:req.body

});


return res.json(progress);



}catch(error){


console.error(error);


return res.status(500).json({

message:"Progress create error"

});


}


});




// GET USER PROGRESS


router.get("/:userId", async(req,res)=>{


try{


const progress = await prisma.progress.findMany({

where:{

userId:Number(req.params.userId)

},

orderBy:{

createdAt:"desc"

}

});



return res.json(progress);



}catch(error){


console.error(error);


return res.status(500).json({

message:"Progress load error"

});


}


});




export default router;