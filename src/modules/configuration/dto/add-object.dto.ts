import { IsOptional, IsString } from 'class-validator';

export class AddObjectnDto {
  @IsString()
  objectName: string;

  @IsString()
  location: string;

  @IsString()
  wifiName: string;

  @IsString()
  wifiPassword: string;

  @IsOptional()
  business: { id: number };
}
