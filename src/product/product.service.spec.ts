import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

const mockProductRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
};

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const createProductDto = {
        productCode: 'P12345',
        productDescription: 'Sample Product',
        location: 'Warehouse A',
        price: 150,
      };

      const savedProduct = {
        id: 1,
        ...createProductDto,
      };

      mockProductRepository.findOne.mockResolvedValue(null); 
      mockProductRepository.create.mockReturnValue(savedProduct); 
      mockProductRepository.save.mockResolvedValue(savedProduct); 

      const result = await service.create(createProductDto);
      expect(result).toEqual(savedProduct);
    });
  });

  describe('findByCode', () => {
    it('should return a product if it exists', async () => {
      const expectedProduct = { id: 1, productCode: 'P12345', location: 'Warehouse A' };
      mockProductRepository.findOne.mockResolvedValue(expectedProduct);

      const result = await service.findByCode('P12345');
      expect(result).toEqual(expectedProduct);
    });

    it('should throw NotFoundException if product is not found', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);

      await expect(service.findByCode('P12345')).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeByCodeOrId', () => {
    it('should remove a product by productCode and return success message', async () => {
      const productToRemove = { id: 1, productCode: 'P12345' };
      mockProductRepository.findOne.mockResolvedValue(productToRemove);
      mockProductRepository.remove.mockResolvedValue(productToRemove);
  
      const result = await service.removeByCodeOrId('P12345', undefined);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({ where: { productCode: 'P12345' } });
      expect(mockProductRepository.remove).toHaveBeenCalledWith(productToRemove);
      expect(result).toEqual({ status: 'success', message: 'Product deleted' });
    });
  
    it('should remove a product by id and return success message', async () => {
      const productToRemove = { id: 1, productCode: 'P12345' };
      mockProductRepository.findOne.mockResolvedValue(productToRemove);
      mockProductRepository.remove.mockResolvedValue(productToRemove);
  
      const result = await service.removeByCodeOrId(undefined, 1);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockProductRepository.remove).toHaveBeenCalledWith(productToRemove);
      expect(result).toEqual({ status: 'success', message: 'Product deleted' });
    });
  
    it('should throw NotFoundException if product is not found by productCode', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);
  
      await expect(service.removeByCodeOrId('P12345', undefined)).rejects.toThrow(NotFoundException);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({ where: { productCode: 'P12345' } });
    });
  
    it('should throw NotFoundException if product is not found by id', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);
  
      await expect(service.removeByCodeOrId(undefined, 1)).rejects.toThrow(NotFoundException);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  
    it('should throw BadRequestException if neither productCode nor id is provided', async () => {
      await expect(service.removeByCodeOrId(undefined, undefined)).rejects.toThrow(BadRequestException);
    });
  });
  
});
