exports.sessionVerfiy =(req,res,next)=>{

    if(req.session.user){
         next();
    }else{
        console.log("sessionVerfiy no")
        return res.json({
            
            error:true,
            success:false,
            
        })
    }

}

exports.sessionVerification =(req,res,next)=>{

    if(req.session.verification){
         next();
    }else{
        console.log("sessionVerification no")
        return res.json({
            error:true,
            success:false,
            
        })
    }

}

exports.googleSessionVerification = (req,res,next)=>{

    if(req.session.googleAuth){
        next();
   }else{
       console.log("googleVerification no")
       return res.json({
           error:true,
           success:false,
           
       })
   }
}