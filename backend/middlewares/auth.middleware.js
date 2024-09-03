import AppError from "../utils/error.util.js"
import jwt from "jsonwebtoken"
const isLoggedIn=async (req,res,next)=>{
    const {token}=req.cookies

    if(!token){
        return next(new AppError('Unauthenticated user',401))
    }

    const userDetail= await jwt.verify(token,process.env.JWT_SECRET)
    req.user=userDetail;
    next();
}

const authorizedRoles=(...roles)=>async(req,res,next)=>{
    const currentUserRoles=req.user.role;
    if(!roles.includes(currentUserRoles)){
        return next(new AppError('Not have permission to perform this action',403))
    }

    next();
}
export { isLoggedIn,authorizedRoles}