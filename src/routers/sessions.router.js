import {Router} from "express"
import userModel from "../model/users.model.js";
import passport from "passport";
import { createHash } from "../utils/utils.js"

const router= Router();

router.post('/resetPassword',async(req,res)=>{
    const {email,password} = req.body;
    if(!email||!password)
        return res.status(400).send({ status:"error", error:"Valores incompletos"})
    const user = await userModel.findOne({email})
    if(!user) 
        return res.status(404).send({status:"error",error:"Usuario no encontrado"})
    const newHashedPassword = createHash(password)
    await userModel.updateOne({_id: user._id}, {$set: {password:newHashedPassword}})
    res.send({ status:"success", message:"Contraseña restaurada"})
})

router.post('/register',
    passport.authenticate('register',{
        passReqToCallback: true,
        session: false,
        failureRedirect:'/failRegister',
        failureMessage: true,
    }),async(req,res)=>{
    res.send({status:"success",message:"Usuario registrado", payload: req.user})
})

router.get('/failRegister',async(req,res)=>{
    res.send({status:'error',error:"Registro fallido"})
})

router.post('/',
    passport.authenticate('login',{
        passReqToCallback: true,
        session: false,
        failureRedirect:'/failLogin',
        failureMessage: true,
    }),async(req,res)=>{
    res.send({status:"success",message:"Usuario iniciado"})
})

router.get('/failLogin',async(req,res)=>{
    res.send({status:'error',error:"Inicio de sesión fallido"})
})

router.get('/github',passport.authenticate('github',{scope:['user:email']}))

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/failLogin' }), (req, res) => {
  req.session.user = req.user;
  res.redirect('/products');
});

export default router;