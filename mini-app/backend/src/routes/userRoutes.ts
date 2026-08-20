import {Router} from "express";

import {prisma} from "../prisma";


const router = Router();




// CREATE USER

router.post("/", async(req,res)=>{


try{


const user = await prisma.user.upsert({


where:{


telegramId:

BigInt(req.body.telegramId)

},



update:{


name:req.body.name


},



create:{


telegramId:

BigInt(req.body.telegramId),


name:

req.body.name || "IRON WARRIOR"


}



});



res.json(user);



}catch(error){


console.error(error);


res.status(500).json({

message:"User create error"

});


}


});








// GET USER


router.get("/:id", async(req,res)=>{


try{


const user = await prisma.user.findUnique({


where:{


id:

Number(req.params.id)

}


});



res.json(user);



}catch(error){


console.error(error);


res.status(500).json({

message:"User load error"

});


}



});






export default router;