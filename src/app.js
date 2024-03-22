import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';


import { Server } from 'socket.io';

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
}) 
const io = new Server(httpServer);

app.engine('handlebars', handlebars.engine());

app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static('public'));

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


io.on('connection', socket => {
    console.log('Nuevo cliente conectado');

    socket.on('newProductAdded', data => {
        console.log('mellego la dataaaaa aaa xfin');
        io.emit('newProductAddedToDOM', data);
    })
})