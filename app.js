const express = require('express');
require('dotenv').config();
const nodeCron = require('node-cron');
require('./src/config/db');
const rateLimit = require('express-rate-limit');
const logger = require('./src/logger/loggger');
const port = process.env.PORT;
const path = require('path');
const { error } = require('./src/utility/error');
const app = express();
const {
  addressRoutes,
  brandRoutes,
  cartRoutes,
  categoryRoutes,
  reviewRoutes,
  userRoutes,
  orderRoutes,
  productRoutes,
  sellerProfileRoutes,
  sellerRoutes,
  adminRoutes,
} = require('./src/routes/');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const { database } = require('./src/config/db');
const { routeCheck } = require('./src/controller');
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

// app.use(()=>{

// })

const specs = swaggerJsDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/src/views'));
app.use('/api/user', orderRoutes);
app.use(express.static(path.join(__dirname, './src/views')));
app.use('/api/auth/admin', adminRoutes);
app.use('/api/auth/seller', sellerRoutes);
app.use('/api/auth/user', userRoutes);
app.use('/api/seller', sellerProfileRoutes);
app.use('/api', addressRoutes);
app.use('/api', productRoutes);
app.use('/api', brandRoutes);
app.use('/api', categoryRoutes);
app.use('/api', cartRoutes);
app.use('/api/user', reviewRoutes);
app.use('/api/*', routeCheck);
app.use(error);

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
