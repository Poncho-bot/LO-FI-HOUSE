var express = require('express');
var router = express.Router();
const User = require("./esquema");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* LOGIN */
router.post("/login", function(req, res, next){

  var user = new User({
    email: req.body.email,
    password: req.body.password,
    direccion: req.body.direccion,
    codigoPostal: req.body.codigoPostal,
    estado: req.body.estado,
    ciudad: req.body.ciudad
  });

  UserSchema.methods.isCorrectPassword = function(candidatePassword, callback){
    bcrypt.compare(candidatePassword, this.password, function(err, same){
        if(err){
          callback(err);
        }else{
          callback(err, same);
        }
    });
  }
  
  //Guarda un registro en Mongo
  console.log("gmail "+req.body.email)
  user.save((err, response) => {
    if (err) res.status(400).send(err);
    res.status(200).send(response);
  });

  //busca un registro mediante el email
  /*
  User.findById(req.body.email, (err, user) => {
    if (err) res.status(400).send(err);
    res.status(200).send(user);
  });
  */
});

module.exports = router;
