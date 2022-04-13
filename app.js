const express = require('express');
require('dotenv').config();
const nodeCron = require('node-cron');
const rateLimit = require('express-rate-limit');
const logger = require('./src/logger/loggger');
const port = process.env.PORT;
const path = require('path');
const app = express();
const cartRoutes = require('./src/routes/addToCart');
const adminRoutes = require('./src/routes/adminRoutes');
const { sellerRoutes } = require('./src/routes/sellerRoutes');
const { userRoutes } = require('./src/routes/userRoutes');
const addressRoutes = require('./src/routes/addressRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const productRoutes = require('./src/routes/productRoutes');
const { database } = require('./src/config/db');
const sellerProfileRoutes = require('./src/routes/sellerProfileRoute');
const brandRoutes = require('./src/routes/brand');
const categoryRoutes = require('./src/routes/category');
const { routeCheck } = require('./src/controller/adminController');
const bodyParser = require('body-parser');
const { mailSendEvery } = require('./src/utility/mailSendUser');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hello World',
      version: '1.0.0',
      description: 'A simple Express Library API',
    },
    servers: [
      {
        url: 'http://localhost:4600',
      },
    ],
    components: {
      securitySchemes: {
        jwt: {
          type: 'http',
          scheme: 'bearer',
          in: 'header',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        jwt: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const limiter = rateLimit({
  windowMs: 01 * 60 * 1000, // 25 minutes
  max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

const specs = swaggerJsDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
const databaseConnection = require('./src/config/db');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/src/views'));

// app.use(express.static(path.join(__dirname, '/src/image')));

app.use(express.static(path.join(__dirname, './src/views')));
app.use('/api/auth/admin', adminRoutes);
app.use('/api/auth/seller', sellerRoutes);
app.use('/api/auth/user', userRoutes);
app.use('/api/seller', sellerProfileRoutes);
app.use('/api/address', addressRoutes);
app.use('/api', productRoutes);
app.use('/api', brandRoutes);
app.use('/api', categoryRoutes);
app.use('/api', cartRoutes);
app.use('/api/*', routeCheck);

function getFromEnv(key) {
  if (process.env[key] == undefined) {
    throw new Error('server not found');
  }
}
nodeCron.schedule('  0 1 * * *', async (req, res) => {
  await mailSendEvery(req, res);
});

app.use((req, res, next) => {
  res.setTimeout(50000, () => {
    console.log('Request has timed out.');
    res.send(408);
  });
  next();
});

app.listen(port, () => {
  getFromEnv('PORT');
  database();
  logger.info(`server is listen at ${port} `);
});
