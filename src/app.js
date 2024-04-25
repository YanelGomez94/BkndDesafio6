import express from "express"
import __dirname from "./utils.js"
import mongoose from "mongoose"
import session from "express-session";
import MongoStore from "connect-mongo";
import handlebars from 'express-handlebars'
import viewRouter from './routes/views.router.js'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/cart.router.js'
import Messages from './dao/dbManagers/messages.js'
import sessionRouter from './routes/sessions.router.js'
import passport from "passport";
import initPassport from "./config/passport.config.js"

import { Server } from "socket.io";

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT,()=>console.log("Server up"))
const io = new Server(httpServer)

const messagesManager = new Messages()

mongoose.set('strictQuery',false)
const connection = mongoose.connect('mongodb+srv://shaniigomez94:jaejoong33@ecommercecoder.pttrffx.mongodb.net/EcommerceCoder')
app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views')
app.set('view engine','handlebars');
app.use(express.static(__dirname + "/public"));

app.use(session({
    store: MongoStore.create({
    mongoUrl:"mongodb+srv://shaniigomez94:jaejoong33@ecommercecoder.pttrffx.mongodb.net/EcommerceCoder",
    ttl:3600
    }),
    secret:"12345abcd",
    resave:false,
    saveUninitialized:false
}))

initPassport();
app.use(passport.session({
    secret:"SecretCoders"
}));

app.use(passport.initialize());

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/',viewRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/session',sessionRouter)

const messages=[];
io.on('connection',socket=>{
    socket.on('message', data=>{
        messages.push(data)
        io.emit('messageLogs',messages)
        messagesManager.addMessage(data)
    })
})