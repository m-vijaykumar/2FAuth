const express=require("express");
const router =express.Router();
const bodyparser=require("body-parser");
const key =require("../../setup/connect").TOKEN_KEY;
const userController = require("../../controllers/user")
const tokenHelper = require("../../helpers/sessionVerfiy")
const passport = require("passport")
require('../../helpers/googleAuth')
const User = require("../../models/User")

router.get("/users",async(req,res)=>{

    await User.find({})
        .then(r=>{
            console.log(r)
        }).catch(err=>{
            console.log(err)
        })
})
// @type    GET
//@route    /api/auth/register
// @desc    starting router
// @access  PRAVITE

router.get("/verify",tokenHelper.sessionVerfiy,(req,res)=>{

    res.json({
        error:false,
        success:true,
        msg:req.session.user.id
    })
});
router.get("/verify/status",tokenHelper.sessionVerification,(req,res)=>{

    res.json({
        error:false,
        success:true,
        msg:req.session.verification.id
    })
});

router.get("/verify/google",tokenHelper.googleSessionVerification,(req,res)=>{

    res.json({
        error:false,
        success:true,
        msg:req.session.googleAuth.id
    })
});

// @type    POST
//@route    /api/auth/register
// @desc    starting router
// @access  PUBLIC

router.post("/register",userController.registervalidCredentials,userController.register);


// @type    POST
//@route    /api/auth/login
// @desc    starting router
// @access  PUBLIC
router.post("/login",userController.loginValidCredentials,userController.login);

// @type    POST
//@route    /api/auth/login
// @desc    starting router
// @access  PUBLIC
router.post("/getstatus",userController.getStatus);

// @type    GET
//@route    /api/auth/login
// @desc    starting router
// @access  PUBLIC
router.get("/verify/email",userController.emailAuth);

// @type    GET
//@route    /api/auth/login
// @desc    starting router
// @access  PUBLIC
router.get("/verify/email/resend",userController.emailAuthResend ,userController.emailAuth);

// @type    GET
//@route    /api/auth/login
// @desc    starting router
// @access  PUBLIC
router.get("/emailverification",userController.emailAuthVerification);

// @type    GET
//@route    /api/auth/login
// @desc    starting router
// @access  PUBLIC

router.get("/verify/phone",userController.phoneAuth);

// @type    GET
//@route    /api/auth/login
// @desc    starting router
// @access  PUBLIC

router.get("/verify/phone/resend",userController.phoneAuth);

// @type    GET
//@route    /api/auth/login
// @desc    starting router
// @access  PUBLIC
router.post("/phoneverification",userController.phoneAuthVerification);


// @type    GET
//@route    /api/auth/google
// @desc    starting router
// @access  PUBLIC
router.get("/google",passport.authenticate('google', {scope : ['profile','email']}));

// @type    POST
//@route    /api/auth/google/verify
// @desc    starting router
// @access  PUBLIC
router.get("/google/callback",passport.authenticate('google',{failureRedirect : '/'}),userController.googleAuthverify);

// @type    GET
//@route    /api/auth/logout
// @desc    starting router
// @access  PRAVITE 

router.post("/getuser", userController.getUser )

// @type    DELETE
//@route    /api/auth/logout
// @desc    starting router
// @access  PRAVITE 

router.delete("/logout", userController.logout )

// // @type    DELETE
// //@route    /api/auth/logout
// // @desc    starting router
// // @access  PRAVITE 

// router.delete("/logout",tokenHelper.sessionVerfiy, userController.logout )

module.exports =router;