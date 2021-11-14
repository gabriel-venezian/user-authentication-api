import { Router, Request, Response, NextFunction } from 'express';
import basicAuthenticationMiddleware from '../middlewares/basic.authentication.middleware';
import jwtAuthenticationMiddleware from '../middlewares/jwt.authentication.middleware';
import ForbiddenError from '../models/errors/forbidden.error.model';
import { StatusCodes } from 'http-status-codes';
import JWT from 'jsonwebtoken';

const authorizationRoute = Router();

authorizationRoute.post('/token', basicAuthenticationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      throw new ForbiddenError('User not informed.');
    };

    const jwtPayload = { username: user.username };
    const jwtOptions = { subject: user?.uuid };
    const secretKey = 'my_secret_key';
    const jwt = JWT.sign(jwtPayload, secretKey, jwtOptions);
    res.status(StatusCodes.OK).json({ token : jwt });
  } catch (error) {
    next(error);
  };
});

authorizationRoute.post('/token/validate', jwtAuthenticationMiddleware, (req: Request, res: Response, next: NextFunction) => {
  res.sendStatus(StatusCodes.OK);
});

export default authorizationRoute;
