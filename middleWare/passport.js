const jwt=require('jsonwebtoken');
module.exports=passport=(req,res,next)=>{
    try {
        var token=req.header("x-token");
        console.log("token :"+token);
        if(!token){
            return res.send('invalid token');
        }
        var decode=jwt.verify(token,"AHVYEjidew0");
        req.user=decode.user;
        next();
    } catch (error) {
        res.send(error);
    }
}