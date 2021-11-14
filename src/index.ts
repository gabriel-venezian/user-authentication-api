import express, { Request, Response, NextFunction } from 'express';
import usersRoute from './routes/users.routes';
import statusRoute from './routes/status.route';
import errorHandler from './middlewares/error.handler.middleware';
import jwtAuthenticationMiddleware from './middlewares/jwt.authentication.middleware';
import authorizationRoute from './routes/authorization.route';

const app = express();

// Application configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes configuration
app.use(statusRoute);
app.use(authorizationRoute);
app.use(jwtAuthenticationMiddleware);
app.use(usersRoute);

// Handlers configuration
app.use(errorHandler);

// Server start
app.listen(3000, () => {
  console.log('App is running in http://localhost:3000/status');
});
