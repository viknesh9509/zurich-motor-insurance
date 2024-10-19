import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        autoLoadEntities: true, 
        synchronize: configService.get<boolean>('POSTGRES_SYNCHRONIZE') || true, 
        // logging: true,  
        cache: {
          duration: 30000, 
        },
        extra: {
          max: 10, 
          min: 2,  
          idleTimeoutMillis: 30000, 
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
