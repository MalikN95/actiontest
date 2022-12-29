import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateConfigurationDto {
  @ApiProperty({
    description: 'Business name',
  })
  @IsString()
  @IsOptional()
  businessName: string;

  @ApiProperty({
    description: 'Business Adress',
  })
  @IsString()
  @IsOptional()
  businessAdress: string;
}
