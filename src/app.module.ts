import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../libs/shared/src/database/database.module';
import { ProductModule } from './product/product.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { RoleCheckMiddleware } from '../libs/shared/src/middleware/role-check.middleware';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 10,
    }]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RoleCheckMiddleware)
      .forRoutes('*');
  }
}