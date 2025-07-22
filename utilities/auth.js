const jwt=require('jsonwebtoken');

const authMiddleware=(req,res,next)=>{
    try {
        const token=req.headers['authorization']?.split(' ')[1];

        if(!token){
            throw new Error()
        }
        jwt.verify(token,process.env.JWT_SECRET)
        next()
    } catch (error) {
        error.status=error.status || 401;
        error.message=req.headers['authorization']?'Unauthorized':'Unauthorized, token missing'
        next(error)
    }
}

module.exports=authMiddleware;