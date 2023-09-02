import 'dotenv/config.js';
import 'express-async-errors'
import express from 'express';
const app = express();

// error handler
import notFoundMiddleware from'./middleware/not-found.js';
import errorHandlerMiddleware from'./middleware/error-handler.js';

app.use(express.json());
// extra packages

// routes
app.get('/', (req, res) => {
    res.send('jobs api');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
const host = 'localhost';

try {
    app.listen(port, () =>
        console.log(`Server is running on  http://${host}:${port} ...`)
    );
} catch (error) {
    console.log(error);
}
