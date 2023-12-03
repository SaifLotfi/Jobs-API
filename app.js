import 'dotenv/config.js';
import 'express-async-errors';
import express from 'express';
const app = express();

//connect DB
import './config/config.js';
//routers
import authRouter from './routes/auth.js';
import jobsRouter from './routes/jobs.js';

//security packages :
import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss-clean';
import rateLimiter from 'express-rate-limit';

//Swagger
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
const swaggerDocument = YAML.load('./swagger.yaml');
// error handler
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import isAuth from './middleware/authentication.js';

app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000,
        max: 100,
    })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// extra packages

// routes
app.get('/', (req, res, next) => {
    res.send('<h1>Jobs API</h1> <a href="/api-docs">Documentation</a>');
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', isAuth, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
let server;
server = app.listen(process.env.PORT, () =>
    console.log(
        `Server is running on  http://${process.env.HOST}:${process.env.PORT} ...`
    )
);

export default server;
