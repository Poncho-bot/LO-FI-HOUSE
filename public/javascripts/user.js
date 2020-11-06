var mongoose = require("mongoose");
//const bcrypt=require('bcryptjs');
var Schema = mongoose.Schema;

var userSchema = new Schema({
/*   method:{
       type:String,
       enum:['local','google','facebook'],
       required:true
   },
   local:{*/
    
  username:{
        type: String,
        required: true,
       unique: 1,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: 1,
        trim: true
    },
   
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    edad:{
        type: Number,
        required: true,
       
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    
    Tipocuenta:{
        type: Number,
        required: true,
    
    }

   }/*,google:{
    id:{
        type:String
    },
    email:{
        type:String,
        lowercase:true
    }
   },
   facebook:{
    id:{
        type:String
    },
    email:{
        type:String,
        lowercase:true
    }
}*/
);
/*userSchema.pre('save', async function (next) {
    try {
      console.log('entered');
      if (!this.methods.includes('local')) {
        next();
      }
      //the user schema is instantiated
      const user = this;
      //check if the user has been modified to know if the password has already been hashed
      if (!user.isModified('local.password')) {
        next();
      }
      // Generate a salt
      const salt = await bcrypt.genSalt(10);
      // Generate a password hash (salt + hash)
      const passwordHash = await bcrypt.hash(this.local.password, salt);
      // Re-assign hashed version over original, plain text password
      this.local.password = passwordHash;
      console.log('exited');
      next();
    } catch (error) {
      next(error);
    }
  });
  
  userSchema.methods.isValidPassword = async function (newPassword) {
    try {
      return await bcrypt.compare(newPassword, this.local.password);
    } catch (error) {
      throw new Error(error);
    }
  }*/
module.exports = mongoose.model('User', userSchema);