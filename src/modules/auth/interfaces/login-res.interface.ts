import { TokenPayload } from 'modules/auth/interfaces/token-payload.interface';

export interface ILoginRes {
  tokenPayload: TokenPayload;
  accessToken: string;
}
