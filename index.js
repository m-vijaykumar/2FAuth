const express = require("express")
const bodyparser =require("body-parser")
const mongoose =require("mongoose");
const expressValidator = require('express-validator');
require('dotenv').config({path:'./.env'});
const helmet = require("helmet");
const path = require("path");
const cors = require("cors")
const session = require("express-session");
const app = express(); 
const passport = require('passport')

const port = process.env.PORT ||5000;

app.use(bodyparser.urlencoded({extended : false}))
app.use(bodyparser.json());

app.use(helmet());


app.use(passport.initialize());
app.use(passport.session());


app.use(expressValidator());
app.use(session({
    secret:require("./setup/connect").TOKEN_KEY,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge : 3600000 * 24 *7 
    },
    maxAge : 3600000 * 24 *7 
}))


app.use(cors());
app.use("/api/auth",require("./routers/api/auth"));

const db =require("./setup/connect").mongodbURL;
const s =async()=>{ 
await mongoose
.connect(db,{ useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true })
.then(()=>console.log("mongodb connceted"))
.catch(err =>console.log(err))
}
s().catch(err => console.log(err))

console.log(process.env.NODE_ENV)


if(process.env.NODE_ENV !== 'production'){
    var reqid = null;
app.get("/",(req,res)=>{
    
    
    res.send("hello");
    
      
      
});

app.get("/check-code",(req,res)=>{

  res.send(`<html><body><form method="post" action="/verify"><lable>code : </lable><input type="text" name="code"><input type="submit" value="submit"></form></body></html>`)

})

app.post("/verify",(req,res)=>{

  let code = req.body.code;
  console.log(`code : ${code}\nrequest_id : ${reqid}`)
  nexmo.verify.check({
    request_id: reqid,
    code: code
  }, (err, result) => {
    if (err) {
      console.error(err);
    } else {

      console.log(result);

    }
  });
  
})

}

app.use(express.static(path.join(__dirname, "client/build")));

    app.get("/*", (req, res) => {
        res.sendFile(path.join(__dirname, "client/build/index.html"), err => {
            res.status(500).send(err);
        });
    });

app.listen(port,console.log(`server is running on ${port}..........`));

module.exports=app;