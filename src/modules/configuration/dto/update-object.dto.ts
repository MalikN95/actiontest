import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateObjectDto {
  @ApiProperty({
    description: 'Object id',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Object Name',
  })
  @IsString()
  objectName: string;

  @ApiProperty({
    description: 'Objects location',
  })
  @IsString()
  location: string;

  @ApiProperty({
    description: 'wifi name',
  })
  @IsString()
  wifiName: string;

  @ApiProperty({
    description: 'wifi Password',
  })
  @IsString()
  wifiPassword: string;
}
