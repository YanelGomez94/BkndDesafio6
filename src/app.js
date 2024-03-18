import express from "express"
import __dirname from "./utils.js"
import mongoose from "mongoose"
import handlebars from 'express-handlebars'
import viewRouter from './routes/views.router.js'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import Messages from './dao/dbManagers/messages.js'


import { Server } from "socket.io";

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Server up and running on port ${PORT}`);
});
const io = new Server(httpServer);

const messagesManager = new Messages();

mongoose.set('strictQuery', false);
const connection = mongoose.connect('mongodb://127.0.0.1:27017/ecommerce?retryWrites=true&w=majority');


app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', viewRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const messages = [];
io.on('connection', socket => {
    socket.on('message', data => {
        messages.push(data);
        io.emit('messageLogs', messages);
        messagesManager.addMessage(data);
    });
});
