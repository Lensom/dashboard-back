import { Request } from 'express';

export interface Auth {}

export interface ExtendedRequest extends Request {
  userEmail?: string;
}
