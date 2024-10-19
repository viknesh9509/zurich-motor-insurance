import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'The product code',
    type: String,
    example: 'P12345',
  })
  @IsString({ message: 'Product code must be a string' })
  @IsNotEmpty({ message: 'Product code is required' })
  productCode: string;

  @ApiProperty({
    description: 'The description of the product',
    type: String,
    example: 'Product 1 Description',
  })
  @IsString({ message: 'Product description must be a string' })
  @IsNotEmpty({ message: 'Product description is required' })
  productDescription: string;

  @ApiProperty({
    description: 'The location of the product',
    type: String,
    example: 'Warehouse A',
  })
  @IsString({ message: 'Location must be a string' })
  @IsNotEmpty({ message: 'Location is required' })
  location: string;

  @ApiProperty({
    description: 'The price of the product',
    type: Number,
    example: 100,
  })
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price must be a positive number' })
  @IsNotEmpty({ message: 'Price is required' })
  price: number;
}
