import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { ServicesDto } from 'modules/services/dto/services.dto';

export class UpdateInformationDto {
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

  @IsOptional()
  @IsArray()
  businessServices?: ServicesDto[];
}
