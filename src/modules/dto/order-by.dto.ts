import { ApiProperty } from '@nestjs/swagger';

export class OrderByDto {
  @ApiProperty({ description: 'Column name' })
  sortColumn: string;

  @ApiProperty({ description: 'ASC or DESC', type: String, default: 'DESC' })
  order: 'ASC' | 'DESC';
}
