import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { FindAllProductsDto } from './dto/query-product.dto';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  beforeEach(async () => {
    const mockProductService = {
      findAll: jest.fn(),
      findByCode: jest.fn(),
      create: jest.fn(),
      updateByCode: jest.fn(),
      removeByCodeOrId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call ProductService.findAll and return the result', async () => {
      const queryDto: FindAllProductsDto = {
        productCode: '',
        location: '',
        page: 1,
        limit: 10,
      };
      const expectedResult = {
        data: [
          {
            id: 1,
            productCode: 'P12345',
            productDescription: 'Sample Description A',
            location: 'Warehouse A',
            price: 100,
          },
          {
            id: 2,
            productCode: 'P12346',
            productDescription: 'Sample Description B',
            location: 'Warehouse B',
            price: 200,
          },
        ],
        pagination: {
          totalItems: 2,
          currentPage: 1,
          pageSize: 10,
          totalPages: 1,
        },
      };

      jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult);

      const result = await controller.findAll(queryDto);

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(queryDto);
    });
  });

  describe('findOne', () => {
    it('should return a product when it exists', async () => {
      const expectedProduct: Product = {
        id: 1,
        productCode: 'P12345',
        productDescription: 'Sample Product',
        location: 'Warehouse A',
        price: 150,
      };
      jest.spyOn(service, 'findByCode').mockResolvedValue(expectedProduct);

      const result = await controller.findOne('P12345');
      expect(result).toBe(expectedProduct);
    });

    it('should throw an exception when product is not found', async () => {
      jest.spyOn(service, 'findByCode').mockResolvedValue(null);

      try {
        await controller.findOne('P12345');
      } catch (error) {
        expect(error.status).toBe(404);
        expect(error.message).toBe('Product not found');
      }
    });
  });

  describe('create', () => {
    it('should call ProductService.create with CreateProductDto', async () => {
      const createProductDto: CreateProductDto = {
        productCode: 'P12345',
        productDescription: 'Sample Product',
        location: 'Warehouse A',
        price: 150,
      };

      const createdProduct: Product = {
        id: 1,
        ...createProductDto,
      };

      jest.spyOn(service, 'create').mockResolvedValue(createdProduct);

      const result = await controller.create(createProductDto);
      expect(result).toBe(createdProduct);
      expect(service.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('update', () => {
    it('should call ProductService.updateByCode with the right arguments', async () => {
      const updateProductDto: UpdateProductDto = {
        productDescription: 'Updated Product',
        location: 'Warehouse B',
        price: 200,
      };

      const updatedProduct: Product = {
        id: 1,
        productCode: 'P12345',
        productDescription: 'Updated Product',
        location: 'Warehouse B',
        price: 200,
      };

      // Mock the service to return the updated product
      jest.spyOn(service, 'updateByCode').mockResolvedValue(updatedProduct);

      const result = await controller.update('P12345', updateProductDto);

      expect(result).toEqual(updatedProduct); // Correctly compare with the updated product
      expect(service.updateByCode).toHaveBeenCalledWith(
        'P12345',
        updateProductDto,
      );
    });
  });

  describe('remove', () => {
    it('should call ProductService.removeByCodeOrId and return success message when productCode is provided', async () => {
      jest.spyOn(service, 'removeByCodeOrId').mockResolvedValue({
        status: 'success',
        message: 'Product deleted',
      });

      const result = await controller.removeByCodeOrId('P12345', undefined);
      expect(result).toEqual({ status: 'success', message: 'Product deleted' });
      expect(service.removeByCodeOrId).toHaveBeenCalledWith(
        'P12345',
        undefined,
      );
    });

    it('should call ProductService.removeByCodeOrId and return success message when id is provided', async () => {
      jest.spyOn(service, 'removeByCodeOrId').mockResolvedValue({
        status: 'success',
        message: 'Product deleted',
      });

      const result = await controller.removeByCodeOrId(undefined, 1);
      expect(result).toEqual({ status: 'success', message: 'Product deleted' });
      expect(service.removeByCodeOrId).toHaveBeenCalledWith(undefined, 1);
    });

    it('should throw a 404 error when the product is not found', async () => {
      jest.spyOn(service, 'removeByCodeOrId').mockResolvedValue(null); // Simulate product not found

      try {
        await controller.removeByCodeOrId('P12345', undefined);
      } catch (error) {
        expect(error.status).toBe(404);
        expect(error.message).toBe('Error deleting product');
      }
    });

    it('should throw a BadRequestException if neither productCode nor id is provided', async () => {
      try {
        await controller.removeByCodeOrId(undefined, undefined);
      } catch (error) {
        expect(error.status).toBe(404); // Bad request
        expect(error.message).toBe('Error deleting product');
      }
    });
  });
});
