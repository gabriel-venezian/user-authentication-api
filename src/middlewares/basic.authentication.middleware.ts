import { Request, Response, NextFunction } from 'express';
import ForbiddenError from '../models/errors/forbidden.error.model';
import userRepository from '../repositories/user.repository';

async function basicAuthenticationMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
      throw new ForbiddenError('Credentials not informed.');
    };
    
    const [authenticationType, token] = authorizationHeader.split(' ');
    if(authenticationType != 'Basic' || !token) {
      throw new ForbiddenError('Invalid authentication type.');
    };
    
    const tokenContent = Buffer.from(token, 'base64').toString('utf-8');
    const [username, password] = tokenContent.split(':'); 
    if (!username || !password) {
      throw new ForbiddenError('Credentials not informed.');
    };
    
    const user = await userRepository.findByUserNameAndPassword(username, password);
    if (!user) {
      throw new ForbiddenError('Invalid username or password.');
    };  

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export default basicAuthenticationMiddleware;
