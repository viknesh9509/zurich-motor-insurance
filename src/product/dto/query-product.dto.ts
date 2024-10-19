import { ApiProperty } from '@nestjs/swagger';

export class FindAllProductsDto {
    @ApiProperty({ required: false })
    productCode?: string;
  
    @ApiProperty({ required: false })
    location?: string;
  
    @ApiProperty({ required: false })
    page?: number;
  
    @ApiProperty({ required: false })
    limit?: number;
  }
  