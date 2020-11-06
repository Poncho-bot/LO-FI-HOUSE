var mongoose = require("mongoose");
var bcrypt = require('bcrypt');
const { trim } = require("jquery");
var Schema = mongoose.Schema;

var saltRounds = 10;

var userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: 1,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true
    },
    direccion: {
        type: String,
        required: true
    },
    codigoPostal: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        required: true
    },
    ciudad: {
        type: String,
        required: true
    }
});

userSchema.pre('save', function(next){
    if(this.isNew || this.isModified('password')){
        var document= this;

        bcrypt.hash(document.password, saltRounds, (err, hashedPassword) =>{
            if(err){
                next(err);
            }else{
                document.password = hashedPassword;
                next();
            }
        });
    }else{
        next();
    }
});

userSchema.methods.isCorrectPassword = function(password, callback){
    bcrypt.compare(password, this.password, function(err, same){
        if(err){
            callback(err);
        }else{
            callback(err, same);
        }
    });
}

module.exports = mongoose.model('User', userSchema);