import { Request, Response, NextFunction } from 'express';
import ForbiddenError from '../models/errors/forbidden.error.model';
import userRepository from '../repositories/user.repository';
import JWT from 'jsonwebtoken';

async function jwtAuthenticationMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
      throw new ForbiddenError('Credentials not found.');
    };

    const [authenticationType, token] = authorizationHeader.split(' ');
    if(authenticationType !== 'Bearer' || !token) {
      throw new ForbiddenError('Invalid authentication type.');
    };

    try {
      const tokenPayload = JWT.verify(token, 'my_secret_key');
      if (typeof tokenPayload !== 'object' || !tokenpayload.sub) {
        throw new ForbiddenError('Invalid token.');
      };

      const user = { 
        uuid: tokenPayload.sub,
        username: tokenPayload.username
      };
      
      req.user = user;
      next();
    } catch (error) {
      throw new ForbiddenError('Invalid token.');
    }
  } catch (error) {
    next(error);
  }
};

export default jwtAuthenticationMiddleware;
