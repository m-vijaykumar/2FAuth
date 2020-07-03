
const jsonwt = require('jsonwebtoken')
const key =require("../setup/connect").TOKEN_KEY;
// const  uuidv4 =require('uuid/v4');
const { uuid } = require('uuidv4');

exports.newToken = () =>{

    try{
    const token = uuid();~
    console.log(token)
    return token
    }
    catch(err){
        return null
    }
}


// exports.verifyAuth = (req,res,next)=>{

//     jsonwt.verify(req.cookies.auth_t, key, (err, user)=> {
//         if(err){
//             console.log(err);
//            return res.render("login");

//         }else if(user){

//          next();
//          }

//          else{
//              res.render("login")
//          }


//     })
// }
// exports.verifyAdminAuth = (req,res,next)=>{

//     jsonwt.verify(req.cookies.auth_t, key, (err, user)=> {
//         if(err){
//             console.log(err);
//            return res.render("/api/admin/login");

//         }else if(user.admin){

//          next();
//          }

//          else{
//              res.redirect("/api/admin/login")
//          }

//     })
// }
