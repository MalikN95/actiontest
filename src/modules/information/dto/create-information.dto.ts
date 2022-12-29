import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { ServicesDto } from 'modules/services/dto/services.dto';

export class CreateInformationDto {
  @IsInt()
  businessId: number;

  @IsBoolean()
  galleryActive: boolean;

  @IsBoolean()
  aboutActive: boolean;

  @IsString()
  aboutTitle: string;

  @IsString()
  @IsOptional()
  aboutImgUrl: string;

  @IsString()
  aboutDescription: string;

  @IsBoolean()
  wifiActive: boolean;

  @IsString()
  wifiName: string;

  @IsString()
  wifiPassword: string;

  @IsBoolean()
  amenitiesActive: boolean;

  @IsString()
  amenitiesTitle: string;

  @IsString()
  amenitiesDescription: string;

  @IsArray()
  @IsOptional()
  businessServices: ServicesDto[];
}
