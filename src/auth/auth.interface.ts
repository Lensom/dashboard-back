import { Request } from 'express';

export interface Auth {}

export interface ExtendedRequest extends Request {
  userId?: string;
}
