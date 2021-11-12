import express, { Request, Response, NextFunction } from 'express';
import usersRoutes from './routes/users.routes';
import statusRoute from './routes/status.route';

const app = express();

// Application configuration
app.use(express.json());
app.use(express.urlencoded({ extend: true }));

// Routes configuration
app.use(usersRoutes);
app.use(statusRoute);

// Server start
app.listen(3000, () => {
  console.log('App is running in http://localhost:3000/status');
});
