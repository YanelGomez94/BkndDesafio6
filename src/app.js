import { config } from 'dotenv';
import { Server } from "socket.io";
import express from "express"
import __dirname from "./utils/utils.js"
import mongoose from "mongoose"
import session from "express-session";
import MongoStore from "connect-mongo";
import handlebars from 'express-handlebars'
import passport from "passport";
import initPassport from "./config/passport.config.js"
import messagesController from './controllers/messages.controller.js';
import productsRouter from './routers/products.router.js';
import cartsRouter from './routers/carts.router.js';
import viewRouter from './routers/views.router.js';
import sessionRouter from './routers/sessions.router.js';

//mongodb+srv://shaniigomez94:jaejoong33@ecommercecoder.pttrffx.mongodb.net/
config();
const PORT= process.env.PORT
const MONGO_USERNAME= process.env.MONGO_USERNAME
const MONGO_PASS= process.env.MONGO_PASS
const MONGO_DBNAME= process.env.MONGO_DBNAME

const app = express();
const puerto = PORT;
const httpServer = app.listen(puerto,()=>console.log("Server up"))
const io = new Server(httpServer)

mongoose.set('strictQuery',false)
const connection = mongoose.connect('mongodb+srv://shaniigomez94:jaejoong33@ecommercecoder.pttrffx.mongodb.net/EcommerceCoder');



app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views')
app.set('view engine','handlebars');
app.use(express.static(__dirname + "/public"));

app.use(session({
    store: MongoStore.create({
      mongoUrl:`mongodb+srv://shaniigomez94:jaejoong33@ecommercecoder.pttrffx.mongodb.net/EcommerceCoder’,

      `,
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
        messagesController.createMessage(data)
    })
})