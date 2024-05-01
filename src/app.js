import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import mongoStore from 'connect-mongo';

import __dirname from './utils.js';
import initializatePassport from './config/passport.config.js';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import usersRouter from './routes/users.router.js';

import { Server } from 'socket.io';
import passport from 'passport';

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
}) 
const io = new Server(httpServer);
const uri = 'mongodb+srv://alegarcia:kali1234@cluster0.ujuurkx.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0'

//mongoose
mongoose.connect(uri);

//handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

//middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser()); 
app.use(session({ 
    store: mongoStore.create({
        mongoUrl: uri,
    }),
    secret: 'asd1966qwer',
    resave: false,
    saveUninitialized: false
}))

//passport
initializatePassport();
app.use(passport.initialize());
app.use(passport.session());


//routes
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/users', usersRouter);

//websocket
io.on('connection', socket => {
    console.log('Nuevo cliente conectado');

    socket.on('newProductAdded', data => {
        io.emit('newProductAddedToDOM', data);
    })

    socket.on('productDeleted', data => {
        io.emit('productDeletedOfDOM', data);
    } )
})