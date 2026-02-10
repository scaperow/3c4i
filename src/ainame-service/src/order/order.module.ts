import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [OrderController],
  providers: [OrderService, ConfigService],
})
export class OrderModule {}
