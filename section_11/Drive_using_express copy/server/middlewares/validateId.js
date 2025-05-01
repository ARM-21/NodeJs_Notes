export default function(req,res,next,id){
    console.log(id)
    if(id.length != 36){
        return res.status(401).json({message:"Invalid Id"+ id})
    }
    next()
}