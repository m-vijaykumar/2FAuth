 
 const nodemailer = require("nodemailer")

 exports.sendMail = async(user,host)=>{

  var transporter =  nodemailer.createTransport({
    host : 'smtp.gmail.com',
    port : 587,
    secure :false,
    auth: {
      user: process.env.Nodemailer_Username,
      pass: process.env.Nodemailer_Password
      // pass: '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'
    }
  }); 
  
  var mailOptions = {
    from: 'gitam.eclub@gmail.com',
    to: user.email,
    subject: 'Account Verfication',
    text: 'Hii ' +user.email +'  to comform your email  Please Click On this Link  \nhttp:\/\/' + host + '\/api/auth/emailverification\/?userId='+ user.id +'&tokenId=' + user.token + '\n please verify your email account \n Thankyou...'
  };
  
   return await transporter.sendMail(mailOptions)
                .then( (info)=>{
                 
                    console.log('Email sent: ' + info.response);
                    return  true
                  
                })
                .catch((err)=>{
                  console.log('Email error: ' + err);
                    return  false
                })
 }

 



  // sgMail.setApiKey('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');
  // const msg = {
  // to: user.email,
  // from: 'vijaykumar416p@gmail.com',
  // subject: 'proxynotes',
  // text: `sample proxy notes ${  code }`,
  // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  // };
  // sgMail.send(msg)
  // .then(send =>{

  //     console.log(send)
  //     return res.render("gmailauth",{
  //                         email : user.email,                                  
  //                     })

  // })
  // .catch(err =>{
      
  //     console.log(err);
  //     res.render("error");
  // } )w