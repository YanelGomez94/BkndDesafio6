import {Router} from "express"
import userModel from "../dao/models/users.js";

const router= Router();

router.post('/register',async(req,res)=>{
    const { first_name,last_name,email, age, password}=req.body;
    const exist = await userModel.findOne({email});

    if(exist) return res.status(400).send({status:"error",error:"El usuario ya existe"})
    
    const user={
        first_name,
        last_name,
        email,
        age,
        password,
    }
    
    let result = await userModel.create(user)
    res.send({status:"success",message:"Usuario registrado"})
})


router.post('/',async(req,res)=>{
    const {email,password}=req.body
    if(email === 'adminCoder@coder.com' && password ==='adminCod3r123'){
        req.session.user={
            name: `Coderhouse`,
            rol: 'admin',
            email:'adminCoder@coder.com',
            age: 'N/A'
        }   
    }else{
        const user = await userModel.findOne({email,password});
        if(!user) return res.status(400).send({status:"error",error:"Credenciales incorrectas"})

        req.session.user={
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            rol: 'usuario'
        }
    }
    res.send({status:"success",payload:req.session.user, message:"Bienvenido"})
})

export default router;