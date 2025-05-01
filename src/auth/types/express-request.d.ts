import { Request } from 'express';
import { PayloadToken } from '../models/token.model';

declare module 'express' {
  export interface Request {
    user?: PayloadToken; // Add the `user` property to the Request interface
  }
}
