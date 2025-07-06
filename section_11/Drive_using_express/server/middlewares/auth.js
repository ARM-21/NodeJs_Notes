import { ObjectId } from "mongodb";

export default async function checkAuth(req,res,next){
    const {uid} = req.cookies;

    try{
 const user = await req.db.collection("users").findOne({_id:new ObjectId(String(uid))})
    console.log(user)
    if(!uid || !user){
        res.status(401).json({message:"unauthorized user"})
        return
    }
    req.user = user;

    next()
    }catch(err){
        res.status(401).json({message:"Internal Server Error Try Again"})
    }
   
}