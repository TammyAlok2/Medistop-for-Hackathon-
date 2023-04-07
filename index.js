import express from 'express'
import path from 'path'
import mongoose, { Schema } from 'mongoose'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken';
import bcrypt, { compare } from 'bcrypt'
//import multer from 'multer';
//import fs from 'fs';
import bodyParser from 'body-parser';
//import report from './Backend/Schema/image.js'
import User from './Backend/Schema/user.js';
const port = 3001
const app = express();
const __dirname = path.resolve();

const users = []

//middlewares
app.set('view engine', 'ejs')
app.use(express.static(path.join(path.resolve(), 'public')))
app.use(express.static(path.join(path.resolve(), 'assests')))
app.use( express.static("public") );
app.use(express.static("assests"));
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//mangodb connection
mongoose
  .connect('mongodb://127.0.0.1:27017/medistopunstop', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('database connected'))  
  .catch(e => console.log(e))


  //using cookie parser 
 
  app.use(cookieParser())
app.set('view engine', 'ejs')
const isAuthenticated = async(req,res,next)=>{
  const {token} = req.cookies;
  if(token){
 const decoded =jwt.verify( token, "medistopsunstops");
 req.user =await User.findById(decoded._id);
   next();
  }
  else{
   res.redirect('/login');
  }
}

app.get('/',isAuthenticated, (req, res) => {
  //onsole.log(req.user);
   res.render('Home');
  })
  app.get('/logout',(req,res)=>{
    res.cookie("token",null,{
      httpOnly:true,
      expires:new Date(Date.now()),
    });
    res.redirect('/');
  });
//all the navigation page bars 
  app.get('/register',(req,res)=>{
    res.render('register');
  })

app.get('/login',(req,res)=>{
  res.render('login');
})
app.get('/appointment',(req,res)=>{
  res.render('appoint')
})
app.get('/prescription',(req,res)=>{
  res.render('prescription')
})



//login the user
app.post('/login', async(req,res)=>{
  const {email,passward} =req.body;
  let user = await User.findOne({email});
 if(!user){
  return res.redirect('/register');
 } 
 const isMatch = await bcrypt.compare(passward ,user.passward) ; 
 if(!isMatch){
  return res.render('login',{ email,message:"Incorrect Passward"});
 }
 const token =jwt.sign({ _id:user._id },"medistopsunstops")
    res.cookie("token",token,{
      httpOnly:true,
      expire:new Date(Date.now()+60*1000),
    });
    res.redirect("/")
  });
  
//registering the user 
app.post('/register', async(req,res)=>{

  const { name ,email,passward} =req.body;
  
  const hashPassward = await bcrypt.hash(passward,12);
  let user = await User.findOne({email});
  if(user){
    return res.redirect('/login');
  }
   // console.log(req.body);
    user =await User.create({
  name ,
  email,
  passward : hashPassward, 
  })
  const token =jwt.sign({ _id:user._id },"medistopsunstops")
  
    res.cookie("token",token,{
      httpOnly:true,
      expire:new Date(Date.now()+60*1000),
    });
    res.redirect("/")
  });


app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})
