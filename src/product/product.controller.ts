import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiSecurity,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from './guard/roles.decorator';
import { RolesGuard } from './guard/roles.guard';
import { Product } from './entities/product.entity';
import { FindAllProductsDto } from './dto/query-product.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@ApiTags('Product')
@ApiSecurity('userRole')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('')
  @ApiOperation({ summary: 'Get products by productCode and location' })
  @ApiQuery({
    name: 'productCode',
    required: false,
    description: 'Filter by product code',
    type: String,
  })
  @ApiQuery({
    name: 'location',
    required: false,
    description: 'Filter by location',
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit number of results per page',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'List of products',
    type: [Product],
  })
  async findAll(@Query() queryParams: FindAllProductsDto) {
    try {
      return await this.productService.findAll(queryParams);
    } catch (error) {
      throw new HttpException(
        'Error retrieving products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('single')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get a single product by productCode (Admin only)' })
  @ApiQuery({
    name: 'productCode',
    required: true,
    description: 'Product code to retrieve',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    type: Product,
  })
  async findOne(@Query('productCode') productCode: string) {
    try {
      return await this.productService.findByCode(productCode);
    } catch (error) {
      throw new HttpException(
        'Error retrieving product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create a new product (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: Product,
  })
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      return await this.productService.create(createProductDto);
    } catch (error) {
      throw new HttpException('Validation error', HttpStatus.BAD_REQUEST);
    }
  }

  @Patch()
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update a product by productCode (Admin only)' })
  @ApiQuery({
    name: 'productCode',
    required: true,
    description: 'Product code to update',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Product updated',
    type: Product,
  })
  async update(
    @Query('productCode') productCode: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      return await this.productService.updateByCode(
        productCode,
        updateProductDto,
      );
    } catch (error) {
      throw new HttpException(
        'Error updating product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete()
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete a product by productCode (Admin only)' })
  @ApiQuery({
    name: 'productCode',
    required: false,
    description: 'Product code to delete',
    type: String,
  })
  @ApiQuery({
    name: 'id',
    required: false,
    description: 'Product ID to delete',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Product deleted' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async removeByCodeOrId(@Query('productCode') productCode?: string, @Query('id') id?: number) {
    try {
      if (!productCode && !id) {
        throw new BadRequestException('Either productCode or id must be provided');
      }
  
      const deleted = await this.productService.removeByCodeOrId(productCode, id);
      if (!deleted) {
        throw new NotFoundException('Product not found');
      }
  
      return { status: 'success', message: 'Product deleted' };
    } catch (error) {
      throw new HttpException('Error deleting product', HttpStatus.NOT_FOUND);
    }
  }
  
}
