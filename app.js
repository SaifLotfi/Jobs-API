import 'dotenv/config.js';
import 'express-async-errors'
import express from 'express';
const app = express();

//connect DB
import connectDB from './db/connect.js';
//routers
import authRouter from './routes/auth.js';
import jobsRouter from './routes/jobs.js';

//security packages :
import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss-clean';
import rateLimiter from 'express-rate-limit';

// error handler
import notFoundMiddleware from'./middleware/not-found.js';
import errorHandlerMiddleware from'./middleware/error-handler.js';
import isAuth from './middleware/authentication.js';

app.use(rateLimiter({
    windowMs:15*60*1000,
    max:100
}));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xxs());

// extra packages

// routes
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/jobs',isAuth,jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
const host = 'localhost';
try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
        console.log(`Server is running on  http://${host}:${port} ...`)
    );
} catch (error) {
    console.log(error);
}
