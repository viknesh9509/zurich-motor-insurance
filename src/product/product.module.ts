import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { RoleCheckMiddleware } from '../../libs/shared/src/middleware/role-check.middleware'; 

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RoleCheckMiddleware) 
      .forRoutes(
        { path: 'product', method: RequestMethod.POST },
        { path: 'product', method: RequestMethod.PATCH },
        { path: 'product', method: RequestMethod.DELETE },
        { path: 'product/single', method: RequestMethod.GET }
      );
  }
}
