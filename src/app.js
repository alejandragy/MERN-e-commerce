import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';


const app = express();
const PORT = 8080; 

app.engine('handlebars', handlebars.engine());

app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static('public'));

app.use('/api/products', productsRouter);

app.use('/api/carts', cartsRouter);

app.use('/', viewsRouter);


app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
})