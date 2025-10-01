import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ status: 1, message: 'Hotel Booking API is running', result: [] });
});

app.use('/api', apiRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ status: 0, message: 'Not Found', result: [] });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    status: 0,
    message: err.message || 'Internal Server Error',
    result: []
  });
});

export default app;
