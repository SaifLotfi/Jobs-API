import 'dotenv/config.js';
import 'express-async-errors'
import express from 'express';
const app = express();

//connect DB
import connectDB from './db/connect.js';
//routers
import authRouter from './routes/auth.js';
import jobsRouter from './routes/jobs.js';


// error handler
import notFoundMiddleware from'./middleware/not-found.js';
import errorHandlerMiddleware from'./middleware/error-handler.js';

app.use(express.json());
// extra packages

// routes
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/jobs',jobsRouter);

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
