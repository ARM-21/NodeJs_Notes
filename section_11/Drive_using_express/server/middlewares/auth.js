import UserData from "../UserDB.json" with {type:'json'};

export default async function checkAuth(req,res,next){
    const {uid} = req.cookies;

    const user = await req.db.collection("users").findOne({id:uid})
    if(!uid || !user){
        res.status(401).json({message:"unauthorized user"})
        return
    }
    req.user = user;
    console.log(user)
    next()
}