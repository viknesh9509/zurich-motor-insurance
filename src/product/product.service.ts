import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { validate } from 'class-validator';
import { FindAllProductsDto } from './dto/query-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Create a new product
  async create(createProductDto: CreateProductDto) {
    const existingProduct = await this.productRepository.findOne({
      where: { productCode: createProductDto.productCode },
    });

    if (existingProduct) {
      throw new BadRequestException(
        'Product with the provided code already exists',
      );
    }

    const newProduct = new Product();
    newProduct.productCode = createProductDto.productCode;
    newProduct.productDescription = createProductDto.productDescription;
    newProduct.location = createProductDto.location;
    newProduct.price = createProductDto.price;

    // Save the product to the database
    return await this.productRepository.save(newProduct);
  }

  // Get all products with optional pagination and filters
  async findAll(queryParams: FindAllProductsDto): Promise<{
    data: Product[];
    pagination: {
      totalItems: number;
      currentPage: number;
      pageSize: number;
      totalPages: number;
    };
  }> {
    const { page = 1, limit = 10, productCode, location } = queryParams;

    const skip = (page - 1) * limit;

    const query = this.productRepository.createQueryBuilder('product');

    // Apply filters based on query parameters
    if (productCode) {
      query.andWhere('product.productCode = :productCode', { productCode });
    }

    if (location) {
      query.andWhere('product.location = :location', { location });
    }

    // Execute query with pagination
    const [products, totalItems] = await query
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: products,
      pagination: {
        totalItems,
        currentPage: page,
        pageSize: limit,
        totalPages,
      },
    };
  }

  // Get a single product by productCode
  async findByCode(productCode: string) {
    const product = await this.productRepository.findOne({
      where: { productCode },
    });
    if (!product) {
      throw new NotFoundException(`Product with code ${productCode} not found`);
    }
    return product;
  }

  // Update a product by productCode
  async updateByCode(productCode: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({
      where: { productCode },
    });
    if (!product) {
      throw new NotFoundException(`Product with code ${productCode} not found`);
    }

    // Merge the update data into the existing product
    Object.assign(product, updateProductDto);

    const validationErrors = await validate(product);
    if (validationErrors.length > 0) {
      throw new BadRequestException({
        message: 'Input data validation failed',
        errors: validationErrors.map((err) => ({
          property: err.property,
          constraints: err.constraints,
        })),
      });
    }

    return await this.productRepository.save(product);
  }

  // Remove a product by productCode
  async removeByCodeOrId(productCode?: string, id?: number): Promise<{ status: string; message: string }> {
    let product: Product | undefined;
  
    if (!productCode && !id) {
      throw new BadRequestException('Either productCode or id must be provided');
    }
  
    if (productCode) {
      product = await this.productRepository.findOne({
        where: { productCode },
      });
    } else if (id) {
      product = await this.productRepository.findOne({
        where: { id },
      });
    }
  
    if (!product) {
      const identifier = productCode
        ? `Product with code ${productCode}`
        : `Product with id ${id}`;
      throw new NotFoundException(`${identifier} not found`);
    }
  
    await this.productRepository.remove(product);
    return { status: 'success', message: 'Product deleted' };
  }
  
}
