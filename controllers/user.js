const User = require("../models/User");
const jsonwt =require("jsonwebtoken");
const cookie =require("cookie-parser");
const key =require("../setup/connect").TOKEN_KEY;
const tokenHelper = require("../helpers/tokenHelper")
const mailHelper = require("../helpers/mailHelper")
const passport = require('passport')
const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: '2a903a23',
  apiSecret: 'ixWg5FiHWqQw5oCQ',
});


exports.ss =(req,res)=>{

    return res.send(req.session.user)
}
exports.vv =(req,res)=>{

    return res.send(req.session.user)
}

exports.registervalidCredentials = (req,res,next) =>{

    console.log(req.body.phone)
    req.assert("username", "Username cannot be empty.").notEmpty();
    req.assert("phone", "Phone no cannot be empty.").len(12,12);
    req.assert("phone", "invalid phone no").isNumeric();
    // req.assert("countrycode", "invalid phone no").notEmpty();
    req.assert("email", "invalied Email").isEmail();
    req.assert("password", "Password cannot be empty").notEmpty();
    req.assert("password", "Password must be greater then 6 characters").len(6,20);

    req.getValidationResult(req,res,next)
    .then((result)=>{
        if(!result.isEmpty()){
            // result.useFirstErrorOnly();.array({useFirstErrorOnly:true});
           console.log( result.array()[0].msg)
            return res.status(400).json({
                error : true,
                msg : result.array()[0].msg
            })
        }
        next();
    });
};
exports.loginValidCredentials = (req,res,next) =>{

    console.log(req.body.username)
    console.log(req.body.password)
    req.assert("email", "email cannot be empty.").notEmpty();
    req.assert("email", "invalied Email").isEmail();
    req.assert("password", "Password cannot be empty").notEmpty();
    req.assert("password", "Invailed Email Or password").len(6,20);

    req.getValidationResult(req,res,next)
    .then((result)=>{
        if(!result.isEmpty()){
            // result.useFirstErrorOnly();.array({useFirstErrorOnly:true});
           console.log( result.array()[0].msg)
            return res.status(400).json({
                error : true,
                msg : result.array()[0].msg
            })
        }
        next();
    });
};

exports.register = async(req,res) =>{

    const username = req.body.username;
    const countryCode = req.body.countrycode;
    const email = req.body.email;
    const phone = req.body.phone;
    console.log(phone);
    const password = req.body.password;
     
            
        await User.checkIfUserExists(email)
        .then(async(result)=>{
            // console.log(result+"&&"+result)
            if(result && result._id){
                // console.log(result+"&&"+result._id)
                return res.status(400).json({
                    error: true,
                    msg: "USER_ALREADY_EXISTS"
                });
            }

            let userobj ={username:username ,email : email ,password:password ,phone:phone }
            let user = new User(userobj);
            user.save()

                .then(()=>{

                        const userData = {
                            id : user.id,
                            username : user.username,
                            email : user.email,
                            phone :user.phone
                        } 
                        try {
                            req.session.verification = userData ;
                            return res.json({
                                error:false,
                                status:false,
                                success:true
                                })
                        } catch (error) {
                            return res.json({
                                error:true,
                                msg:"internal Error...!"
                            })
                        }   

                })
                .catch(e=>{
                    // console.log(e);
                    return res.json({
                        error:true,
                        msg:"internal Error...!"
                    })
                })

        })
        .catch((err)=>{
            return res.status(500).json({
                error: true,
                msg: err.message
            });
        });
    
};


exports.login= (req,res)=>{

    const email = req.body.email;
    const password =req.body.password;

    User.checkIfUserExists(email)
        .then(async(result)=>{
            // console.log(result)
            
            if( !result || !result._id){               
                return res.json({
                    error: true,
                     msg: "Invalid Input Or Password"
                });
            }
            
                const userData = {
                    id : result.id,
                    username : result.username,
                }
        User.comparePassword(password,result.password)
                .then((isMatch)=>{

                if(isMatch){

                console.log(result.emailVerification.status)
            console.log(result.mobileVerification.status)
            if (!((result.emailVerification.status) && (result.mobileVerification.status))) {

                const userData = {
                    id : result.id,
                    username : result.username,
                    email : result.email,
                    phone :result.phone
                }
                try {
                    req.session.verification = userData ;
                    console.log("true")
                    return res.json({
                        error:true,
                        status:false,
                        msg:"verification no done !"
                    })
                } catch (error) {
                    console.log("catch")
                    return res.json({
                        error:true,
                        msg:"internal Error...!!!"
                    })
                }
     
            }

                    const payload ={
                        id:result.id,
                        email :result.email,
                    };

                    try {
                        req.session.user = payload ;
                        return res.json({ 
                            error:false,
                            success:true,
                            status : true
                        })
                    } catch (error) {
                        return res.json({
                            error:true,
                            msg:"internal Error...!"
                        })
                    }  

                    }else{

                    return res.status(401).json({
                        error:true,
                        msg:"invalid Email or Password"
                    })
                    }

                })
                .catch((err)=>{
                    console.log(err)
                    return res.json({
                        error: true,
                        msg:err
                    });
                })
        })

};

exports.logout =(req,res)=>{

    console.log("in logout")
    try {
        req.logOut();
        
        req.session.destroy();
        // console.log(req.session.verification.id)
        return res.json({
            error:false,
            msg:"logout"
        })
    } catch (error) {
        console.log(error)
        return res.json({
            error:true,
            msg:"error in logout"
        })
    }
    

}

exports.getStatus = async(req,res)=>{

   await User.findOne({_id:req.body.id},{password:0,_v:0})
        .then((result)=>{
            console.log(result)
            return res.json({
                error:false,
                status :{ email : result.emailVerification.status , phone : result.mobileVerification.status }
            })
           
        }).catch((err)=>{
            console.log(err)
            return res.json({
                error:true,
                msg:"Internal Error....!"
            })
        })
}
 
exports.emailAuth = async(req,res)=>{

    try{
    const token = await tokenHelper.newToken();
   const  userData = {
       id : req.session.verification.id,
       email : req.session.verification.email,
       token : token
   } 
    jsonwt.sign(userData, key,
        { expiresIn: 50*60*1000 },
        async(err, token) => {
            if(err){
                console.log(err)
                return res.json({
                    error:true,
                    msg : "Account Is Not Verifed" 
                })
            }
        res.cookie("email_t", token, { maxAge: 50*60*1000 })


        await User.updateStatus (req.session.verification.id,{'emailVerification.secret_id' : userData.token})
                .then(async(result)=>{
                    console.log(result);
                    await mailHelper.sendMail(userData,req.headers.host)
                            .then(async (x)=>{
                                await console.log(x)
                                if(!x){
                                    return res.json({
                                        error:true,
                                        msg : "Error in SMTP"
                                    })
                                }else{

                                  return  res.json({
                                        error : false,
                                        msg : "Mail Send",
                                    
                                    })
                                }
                            })
                            .catch((err) =>{
                                console.log(err)
                                return res.json({
                                    error:true,
                                    msg : "Error in SMTP"
                                })
                            })
                    })
                    .catch((err)=>{
                        return res.json({
                            error:true,
                            msg : "Internal Error...!"
                        })
                    })

                })  
    } catch (error) {
        return res.json({
            error:true,
            msg :"id not defind"
        })
    }
}
exports.emailAuthResend = async(req,res)=>{

    try {
   await res.clearCookie("email_t")
        next();
    } catch (error) {
        console.log(error)
        next();
    }
}
exports.emailAuthVerification =(req,res)=>{
    
    const token = req.param('tokenId')
    const userId = req.param('userId')
    User.checkIfUserExistsWithId(userId)
        .then((result)=>{
            if(result && result._id){
                // console.log(result+"&&"+result._id)
                if(result.emailVerification.secret_id == token){
                    User.updateStatus(userId , {'emailVerification.status' : true})
                        .then((result)=>{
                           return res.json({
                                error:false,
                                message : 'emailVerfication done'
                            })
                        })
                        .catch(err =>{
                           return res.json({
                                error:true,
                                message_occur:'UPDATESTAUS CATCH',
                                message : err
                            })
                        })
                }else{

                   return res.json({
                        error: true,
                        message_occur:'if uuidcode',
                        message:'please Check the link'
                    })
                }

            }else{
                return res.json({
                    error: true,
                    message_occur:'else result id',
                    message:'please Check the link'
                })
            }
        })
        .catch(err =>{
            return res.json({
                error: true,
                message_occur:'last CATCH',
                message:err
            })
        })

}


exports.phoneAuth = async(req,res)=>{

    try {
        
        const  userData = {
            id : req.session.verification.id,
            phone : req.session.verification.phone,
        } 
        console.log("id    : " + req.session.verification.id)
             nexmo.verify.request({
                number: userData.phone,
                brand: 'vijay',
                code_length: '6'
            },async(err, result) => {

                if (err) {
                    return res.json({
                        error:true,
                        msg:err
                    })
                }
                console.log(result )
                if (result.status == 0) {
                    
                    await User.updateStatus (req.session.verification.id,{'mobileVerification.secret_id' : result.request_id})
                        .then(async(r)=>{
                            console.log(r)
                            res.json({
                                error:false,
                                msg:"otp send"
                            })
                        }).catch(err =>{
                            console.log(err)
                            return res.json({
                                error:true,
                                msg : "internal error"
                            })
                        })
                    
                }else{
                    return res.json({
                        error:true,
                        msg:result.error_text
                    })
                }

        });

    }catch (error) {
        return res.json({
            error:true,
            msg :"id not defind"
        })
    }

}

exports.phoneAuthVerification = async(req,res)=>{

    await User.checkIfUserExistsWithId(req.session.verification.id)
        .then(async(result)=>{
            if(result && result._id){
                const reqid = result.mobileVerification.secret_id;
                const code = req.body.code;
                console.log(`code : ${code}\nrequest_id : ${reqid}`)
                nexmo.verify.check({
                    request_id: reqid,
                    code: code
                }, async(err, result) => {

                    if (err) {
                        return res.json({
                            error:true,
                            msg:err
                        })
                    } else {

                        console.log(result);

                        if (result.status == 0) {
                            await User.updateStatus(req.session.verification.id , {'mobileVerification.status' : true})
                            .then((result)=>{
                            return res.json({
                                    error:false,
                                    msg : 'mobileVerification done'
                                })
                            })
                            .catch(err =>{
                            return res.json({
                                    error:true,
                                    message_occur:'UPDATESTAUS CATCH',
                                    msg : err
                                })
                            })
                        }else{

                            return res.json({
                                 error: true,
                                 message_occur:'if uuidcode',
                                 msg:result.error_text
                             })
                        }

                    }
                });
            }
        }).catch((err)=>{

        })
}


exports.googleAuth =(req,res)=>{

    // passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
    
}

exports.googleAuthverify = (req,res)=>{
    
        const userData = {
            id : req.user.id,
            googleId : req.user.googleId,
            username :req.user.username,
            email : req.user.email

        }
        console.log(userData)
        req.session.googleAuth = userData
        res.redirect("http://localhost:3000/dashboard")
          
    }


exports.getUser =async (req,res) =>{
    console.log(req.body.id)
    await User.getUserDateWithId(req.body.id)

            .then((result)=>{
                console.log("getuser   :")
                console.log(result)
                return res.json({
                    error:false,
                    user:result
                })
            }).catch((err)=>{
                console.log(err)
                return res.json({
                    error:true,
                    msg:"Error"
                })
            })

}
 
// exports.updateUser = (req,res)=>{

//     var userData ={
//         email : req.body.email,
//         phone : req.body.phone
//     }

// //     User.updateUser = 
    
// // }

