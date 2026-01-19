const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config();
const productsRoute = require('./routes/productsRoute')
const employeesRoute = require('./routes/employeesRoute')
const clientsRoute = require('./routes/clientsRoute');
const ordersRoute = require('./routes/ordersRoute');
const authRoute = require('./routes/auth');
const dashboardRoute = require('./routes/dashboardRoute')
const authMiddleware = require('./middlewares/authMiddleware');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', authRoute);
app.use(authMiddleware);
app.use('/clients', clientsRoute);
app.use('/products', productsRoute);
app.use('/employees', employeesRoute);
app.use('/orders', ordersRoute);
app.use('/dashboard', dashboardRoute);

const PORT = 5000;
const server = app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

server.keepAliveTimeout = 300000;
