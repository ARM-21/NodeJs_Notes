import { ObjectId } from "mongodb";

export default async function checkAuth(req,res,next){
    const {uid} = req.cookies;

    const user = await req.db.collection("users").findOne({_id:new ObjectId(String(uid))})
    console.log(user)
    if(!uid || !user){
        res.status(401).json({message:"unauthorized user"})
        return
    }
    req.user = user;
    console.log(user,'user is behind')
    next()
}