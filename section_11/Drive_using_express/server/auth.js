import UserData from "../server/UserDB.json" with {type:'json'};

export default function checkAuth(req,res,next){
    const {uid} = req.cookies;
    const user = UserData.find((user)=>{
        return user.id == uid;
    })
    if(!uid || !user){
        res.status(401).json({message:"unauthorized user"})
        return
    }
    req.user = user;
    next()
}