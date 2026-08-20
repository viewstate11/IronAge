import {Router} from "express";

import {prisma} from "../prisma";


const router = Router();



router.put("/:id",async(req,res)=>{


const user = await prisma.user.update({

where:{

id:Number(req.params.id)

},

data:{


premiumPlan:req.body.plan


}


});


res.json(user);


});



export default router;