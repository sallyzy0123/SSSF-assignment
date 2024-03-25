import {
  addUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from '../models/userModel';
import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import bcrypt from 'bcryptjs';
import {User} from '../../types/DBTypes';
import {MessageResponse} from '../../types/MessageTypes';
import {Result, validationResult} from 'express-validator';
const salt = bcrypt.genSaltSync(12);
import jwt, { JwtPayload } from 'jsonwebtoken';

const userListGet = async (
  _req: Request,
  res: Response<User[]>,
  next: NextFunction
) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const userGet = async (
  req: Request<{id: string}, {}, {}>,
  res: Response<User>,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const user = await getUser(id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// ✅
// TDOD: create userPost function to add new user
// userPost should use addUser function from userModel
// userPost should use validationResult to validate req.body
// - user_name should be at least 3 characters long
// - email should be a valid email
// - password should be at least 5 characters long
// userPost should use bcrypt to hash password
const userPost = async (
  req: Request<{}, {}, Pick<User, 'user_name' | 'email' | 'password'>>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  const errors = validationResult(req.body);
  if (errors.isEmpty()) {
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    const newUser = {
      "user_name": req.body.user_name,
      "email": req.body.email,
      "password": passwordHash
    }

    try {
      const result = await addUser(newUser);
      res.json(result)
    } catch (error) {
      next(error)
    }
  }
};

const userPut = async (
  req: Request<{id: number}, {}, User>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('user_post validation', messages);
    next(new CustomError(messages, 400));
    return;
  }

  try {
    if (req.user && req.user.role !== 'admin') {
      throw new CustomError('Admin only', 403);
    }

    let _user = req.body;
    if (req.body.password) {
      const passwordHash = await bcrypt.hash(req.body.password, salt);
      _user = {
        ...req.body,
        password: passwordHash,
      } 
    }
    const result = await updateUser(_user, req.params.id);

    res.json(result);
   
  } catch (error) {
    next(error);
  }
};

// ✅
// TODO: create userPutCurrent function to update current user
// userPutCurrent should use updateUser function from userModel
// userPutCurrent should use validationResult to validate req.body
const userPutCurrent = async (
  req: Request<{}, {}, User>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('user_put_current validation', messages);
    next(new CustomError(messages, 400));
    return;
  }
  try {
    if (!req.user?.user_id || !req.user?.role) {
      throw new CustomError('No user', 400);
    }
    let _user = req.body;

    if (req.body.password) {
      const passwordHash = await bcrypt.hash(req.body.password, salt);
      _user = {
        ...req.body,
        password: passwordHash,
      }
    }

    console.log('user', _user);
    const result = await updateUser(_user, req.user.user_id);
    res.json(result);
   
  } catch (error) {
    next(error);
  }
};

// ✅
// TODO: create userDelete function for admin to delete user by id
// userDelete should use deleteUser function from userModel
// userDelete should use validationResult to validate req.params.id
// userDelete should use req.user to get role
const userDelete = async (
  req: Request<{id: number}, {}, User>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('user_delete validation', messages);
    next(new CustomError(messages, 400));
    return;
  }

  try {
    if (req.user && req.user.role !== 'admin') {
      throw new CustomError('Admin only', 403);
    }

    const result = await deleteUser(req.params.id);

    res.json(result);
   
  } catch (error) {
    next(error);
  }
};

const userDeleteCurrent = async (
  req: Request,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('cat_post validation', messages);
    next(new CustomError(messages, 400));
    return;
  }

  try {
    if (!req.user?.user_id) {
      throw new CustomError('No user', 400);
    }
    const result = await deleteUser(req.user.user_id);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const checkToken = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next(new CustomError('token not valid', 403));
  } else {
    res.json(req.user);
  }
};

export {
  userListGet,
  userGet,
  userPost,
  userPut,
  userPutCurrent,
  userDelete,
  userDeleteCurrent,
  checkToken,
};
