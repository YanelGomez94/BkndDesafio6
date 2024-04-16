import passport from "passport";
import local from "passport-local";
import userModel from "../dao/models/users.js";
import githubService from 'passport-github2';
import { createHash, isValidPassword } from "../utils.js";

const localStrategy = local.Strategy;

const initPassport =() =>
{
    passport.serializeUser((user,done)=>{
        done(null,user)
    });
    
    passport.deserializeUser(async(id,done)=>{
        //let user = await githubService.findById(id);
        try {
            const user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    })

    passport.use("register", new localStrategy({ 
        passReqToCallback: true, 
        usernameField: "email" 
    },  async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                let user = await userModel.findOne({ email: username })
                if (user) {
                    console.log("Error. El usuario ya existe.")
                    return done(null, false)
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                }
                let result = await userModel.create(newUser)
                return done(null, result)
            } catch (error) {
                return done("Error para registrar usuario. " + error)
            }
        })
    );

    passport.use( "login", new localStrategy({ 
        passReqToCallback: true, 
        usernameField: "email",
        passwordField:'password'
    },  async (req, username, password, done) => {
            try{
                if(username === 'adminCoder@coder.com' && password ==='adminCod3r123'){
                    req.session.user={
                        name: `Coderhouse`,
                        rol: 'admin',
                        email:'adminCoder@coder.com',
                        age: 'N/A'
                    }   
                }else{
                    const user = await userModel.findOne({email: username});
                    if (!user) {
                        console.log("Error. El usuario no existe.")
                        return done(null, false)
                    }
                    if(!isValidPassword(user, password)){
                        console.log("Error. Las contraseñas no coinciden.")
                        return done(null, false)
                    }
                    req.session.user={
                        name: `${user.first_name} ${user.last_name}`,
                        email: user.email,
                        age: user.age,
                        rol: 'usuario'
                    }
                    return done(null,user)
                }
            }catch(error){
                return done('Error para iniciar sesión con el usuario. ' + error)
            }
            
        })
    )

    passport.use('github', new githubService({
        clientID: "Iv1.b680595be8f4648f",
        clientSecret: "e1ebb71a4fc3fea206c60e6d0bc3e2cbda41a3bf",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken,refreshToken,profile, done)=>
        { 
            try{
            let user = await userModel.findOne({first_name:profile._json.name.split(' ')[0]})
            if(!user){
                let newUser = {
                    first_name: profile._json.name.split(' ')[0],
                    last_name: profile._json.name.split(' ')[1],
                    age: 18,
                    email: 'correoprueba@gmail.com',
                    password:''
                }
                let result = await userModel.create(newUser)
                done(null,result)
            }else{
                done(null,user)
            }
        }catch(error){
            return done(error)
        }
    }))
}

export default initPassport;