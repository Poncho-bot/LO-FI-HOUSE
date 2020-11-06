var express = require('express');
var router = express.Router();
var nombres = ['fernando' , 'adrian', 'juande' , 'angel' , 'david' , 'eduardo' , 'luis' , 'diego' , 'rebeca' , 'aldo'];
var fs=require('fs');
var path = require('path');
var mediaserver = require('mediaserver');
var multer = require('multer');
var Post = require('./esquema');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var user = require('./esquema');
var axios = require('axios');

var opcionesMulter = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, path.join(__dirname, 'canciones'));
  },
  filename: function(req, file, cb){
    cb(null, file.originalname)
  }
});

var upload = multer({storage: opcionesMulter});



require('dotenv').config();
const { response } = require('express');
const { google } = require('googleapis');
const app = require('../app');

google.youtube('v3').search.list({
    key: process.env.YOUTUBE_TOKEN,
    part: 'snippet',
    q:'joji',
}).then((response) => {
    const {data} = response;
    data.items.forEach((item) => {
        console.log(`Title: ${item.snippet.title}\nDescription:${item.snippet.description}\n`);
    })
}).catch((err) => console.log(err));


router.get('/streaming', function(req,res,next){
  res.render('pages/streaming',{page: 'streaming' , menuId: 'streaming' , title: 'nombres'});
});

/* Pagina principal Home*/
router.get('/', function(req,res,next){
  res.render('index', {page: 'Home' , menuId:'home' , title: 'Nombres'});
});

/* Ruta nueva al Ubicación*/

router.get('/ubicacion', function(req,res,next){
  res.render('pages/gps', {page: 'ubicacion' , menuId:'ubicacion' , title: 'Nombres'});
});

router.get('/signup/values', async (req, res) => {
  try{
      var posts = await Post.find();
      res.json(posts);
  }catch(err){
      res.json({message:err});
  }
});

router.get('/canciones', function(req, res, next){
  fs.readFile(path.join(__dirname, '/canciones.json'), 'utf8', function(err, canciones) {
    if(err) throw err;
    res.json(JSON.parse(canciones));
  })
})

router.get('/canciones/:nombre', function(req, res, next){
  var cancion = path.join(__dirname, 'canciones', req.params.nombre);
  mediaserver.pipe(req, res, cancion);
})

router.get('/login', function(req, res, next){
  res.render('pages/login', {page: 'login', menuId:'login', title: 'nombres'});
});

router.get('/signup', function(req, res, next){
  res.render('pages/signup', {page: 'signup', menuId:'signup', title: 'nombres'});
});

router.get('/clima', function(req, res, next){
  res.render('pages/clima', {page: 'clima', menuId: 'clima', title: 'nombres'});
});

router.get('/clima/latitude/:latitude/longitude/:longitude', (req, res, next) => {
  console.log(req.params.latitude, req.params.longitude);
  if(!req.params.latitude || !req.params.longitude){
    res.status(404).json({
      msg: 'error'
    });
  }

  let latitude = parseInt(req.params.latitude, 10);
  let longitude = parseInt(req.params.longitude, 10);

  axios.get(`http://api.openweathermap.org/data/2.5/weather?
  lat=${latitude}&lon=${longitude}&appid=bd4275edd835cb90a48b60fb5bb77610`)
  .then(response => {
    res.json({
      temperature: response.data.main.temp,
      name:response.data.name
    })
  })
  .catch(error => {
    console.log(error);
    next()
    return;
  });
});

router.post('/canciones', upload.single('cancion'), function(req, res){
  var archivoCanciones = path.join(__dirname, '/canciones.json')
  var nombre = req.file.originalname;
  fs.readFile(path.join(__dirname, '/canciones.json'), 'utf8', function(err, archivo){
    if(err) throw err;
    var canciones = JSON.parse(archivo);
    canciones.push({nombre: nombre});
    fs.writeFile(archivoCanciones, JSON.stringify(canciones), function(err){
      if (err) throw err;
      res.sendFile(path.join(__dirname, 'streaming.ejs'));
    })
  });
});

//Metodo POST
router.post('/register', async (req, res) => {
  var post = new Post({
    email: req.body.email,
    password: req.body.password,
    direccion: req.body.direccion,
    codigoPostal: req.body.codigoPostal,
    estado: req.body.estado,
    ciudad: req.body.ciudad
  });
  try{
   var savedPost = await post.save();
  res.json(savedPost); 
  }catch(err){
      res.json({message: err});
  }
  
});

router.post('/', (req,res) =>{
  var{email, password} = req.body;

  var user = new user({email, password});

  user.save(err =>{
    if(err){
     res.status(500).send('ERROR AL REGISTRAR AL USUARIO'); 
    }else{
      res.status(200).send('server started');
    }
  });
});
router.post('/authenticate', (req, res) =>{
  var{email, password} = req.body;

  user.findOne({email}, (err, user) =>{
      if(err){
        res.status(500).send('ERROR AL AUTENTICAR AL USUARIO');
      }else if(!user){
          res.status(500).send('EL USUARIO NO EXISTE');
      }else{
          user.isCorrectPassword(password, (err, result) =>{
            if(err){
              res.status(500).send('ERROR AL AUTENTICAR');
            }else if(result){
                  res.status(200).send('USUARIO AUTENTICADO CORRECTAMENTE');
            }else{
              res.status(500).send('USUARIO Y/O CONTRASEÑA INCORRECTOS');
            }
          });
      }
  });
});

//Metodo PUT
router.put('/greeting', function(req, res){
  res.send('Te doy un saludo con Greeting');
});

//Metodo DELETE
router.delete('/hello', function(req, res){
  res.send('Te doy un saludo con DELETE');
});
module.exports = router;
