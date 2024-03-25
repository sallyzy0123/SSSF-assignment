import express from 'express';
import {
  checkToken,
  userDelete,
  userDeleteCurrent,
  userGet,
  userListGet,
  userPost,
  userPut,
  userPutCurrent,
} from '../controllers/userController';
import passport from '../../passport';
import {body, param} from 'express-validator';
import {validationErrors} from '../../middlewares';

const router = express.Router();

router
  .route('/')
  .get(userListGet)
  .post(
    body('user_name').trim().isLength({min:3}).escape(), 
    body('email').trim().isEmail(),
    validationErrors,
    userPost)
  .put(
    passport.authenticate('jwt', {session: false}), 
    body('user_name').trim().isLength({min:3}).escape(),
    validationErrors,
    userPutCurrent)
  .delete(passport.authenticate('jwt', {session: false}), userDeleteCurrent);

router.get(
  '/token',
  passport.authenticate('jwt', {session: false}),
  checkToken
);

router
  .route('/:id')
  .get(userGet)
  .put(passport.authenticate('jwt', {session: false}), userPut)
  .delete(passport.authenticate('jwt', {session: false}), userDelete);

export default router;
