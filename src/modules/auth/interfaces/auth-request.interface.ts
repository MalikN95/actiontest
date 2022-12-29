import { Request } from 'express';
import { TokenPayload } from './token-payload.interface';

export interface AuthRequest extends Request {
  user: TokenPayload;
}
