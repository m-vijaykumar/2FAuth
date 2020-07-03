const mongoose =require("mongoose");
const bcrypt = require('bcryptjs');


const  Schema = mongoose.Schema;
const userSchema = new Schema({

    googleId:{
        type:String,
        required:false
    },
    username:{
        type: String,
        required:true
    },
    email:{
        type: String,
        require:true
    },
    phone:{
        type:Number,
        require:true
    },
    password:{
        type: String,
        require:true
    },
    date:{
        type:Date,
        default :Date.now
    },
    emailVerification:{
        status:{
            type:Boolean,
            default:false,
            require:true
        },
        secret_id:{
            type:String,
            default:null,
            require:true
        }
    },
    mobileVerification:{
        status:{
            type:Boolean,
            default:false,
            require:true
        },
        secret_id:{
            type:String,
            default:null,
            require:true
        }
    }
    
})

userSchema.pre('save', function(next){
    var user = this;
    const saltRounds = 12;

    if (!user.isModified('password')) {
        console.log("password not modified")
        return next();
    }
    bcrypt.hash(user.password, saltRounds, function(err, hash) {
        console.log("password  modified")
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

userSchema.statics.checkIfUserExists = async(email)=>{

    return await User
      .findOne({email:email},{_v:0})
      .then((result)=>{
        //   console.log(result)
          return result;
      })
      .catch((err)=>{
          throw err;
      })
  };
  userSchema.statics.checkIfUserExistsWithId = async(userId)=>{
  
    return await User
      .findOne({_id:userId},{password:0,_v:0})
      .then((result)=>{
        //   console.log(result)
          return result;
      })
      .catch((err)=>{
          throw err;
      })
  };
  userSchema.statics.getUserDateWithId = async(userId)=>{
  
    return await User
      .findOne({_id:userId},{password:0,__v:0,_id:0,emailVerification :0 , mobileVerification :0})
      .then((result)=>{
        //   console.log(result)
          return result;
      })
      .catch((err)=>{
          throw err;
      })
  };
  
userSchema.statics.comparePassword = (input_password,current_password)=>{

    return bcrypt.compare(input_password,current_password)
 }

 userSchema.statics.updateStatus = async(id , data)=>{

    return await User.findOneAndUpdate({_id : id}, data,{new:true ,password: 0, _v: 0})
                    .then((result)=>{
                        console.log(result)
                        return result.emailVerification
                    })
                    .catch((err)=>{
                        console.log(err)
                       return  err;
                    })
 }
const User = module.exports  = mongoose.model("users",userSchema);