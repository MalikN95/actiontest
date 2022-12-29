import { IsArray, IsInt, IsString } from 'class-validator';
import { AddObjectnDto } from 'modules/configuration/dto/add-object.dto';

export class CreateConfigurationDto {
  @IsInt()
  businessId: number;

  @IsString()
  businessName: string;

  @IsString()
  address: string;

  @IsArray()
  businessObjects: AddObjectnDto[];
}
