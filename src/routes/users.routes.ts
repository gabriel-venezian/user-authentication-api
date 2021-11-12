import { Router, Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import userRepository from '../repositories/user.repository';

const usersRoutes = Router();

// Get all users
usersRoutes.get('/users', async (req: Request, res: Response, next: NextFunction) => {
  const users = await userRepository.findAllUsers();
  res.status(StatusCodes.OK).send(users);
});

// Get a specified user
usersRoutes.get('/users/:uuid', async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
  const uuid = req.params.uuid;
  const user = await userRepository.findById(uuid);
  res.status(StatusCodes.OK).send(user);
});

// Add new users
usersRoutes.post('/users', async (req: Request, res: Response, next: NextFunction) => {
  const newUser = req.body;
  const uuid = await userRepository.addUser(newUser);
  res.status(StatusCodes.CREATED).send(uuid);
});

// Change a specified user information
usersRoutes.put('/users/:uuid', (req: Request<{ uuid: string}>, res: Response, next: NextFunction) => {
  const uuid = req.params.uuid;
  const modifiedUser = req.body;
  modifiedUser.uuid = uuid;
  res.status(StatusCodes.OK).send({modifiedUser});
});

// Delete a specified user
usersRoutes.delete('/users/:uuid', (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
  const uuid = req.params.uuid;
  res.sendStatus(StatusCodes.OK);
});

export default usersRoutes;
