import 'dotenv/config.js';
import mongoose from 'mongoose';

// env setup
const env = process.env.NODE_ENV || 'development';
if (env === 'testing') {
    Object.assign(process.env, {
        PORT: 3000,
        DB_NAME: 'Jobs-Test',
    });
}

// database connection
  mongoose
    .connect(process.env.MONGO_URI, {
        dbName: process.env.DB_NAME,
    })
    .then(() =>
        console.log(`connected successfully to DB: ${process.env.DB_NAME}`)
    )
    .catch((error) => console.log(`failed to connect to DB: ${error}`));

export default mongoose;
