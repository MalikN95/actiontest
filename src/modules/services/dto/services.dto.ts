import { IsOptional, IsString } from 'class-validator';
import { ServicesTypesEnum } from '../enums/services.enum';

export class ServicesDto {
  @IsString()
  serviceTitle: string;

  @IsString()
  serviceDescription: string;

  @IsString()
  serviceType: ServicesTypesEnum;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsOptional()
  business: { id: number };
}
