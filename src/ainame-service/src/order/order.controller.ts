// byte.controller.ts
import { Controller, Post, Body, Logger } from '@nestjs/common';
import { OrderService } from './order.service';
import { TTPaymentCallback } from './types';
import { NameData } from './entities/order.entity';

@Controller('order')
export class OrderController {
  logger: Logger = new Logger(OrderController.name, { timestamp: true });

  constructor(private readonly byteService: OrderService) {}

  @Post('token')
  async getToken() {
    return await this.byteService.getToken();
  }

  @Post()
  async createOrder(
    @Body()
    body: {
      nameData: NameData;
      code: string;
      anonymousCode: string;
    },
  ) {
    this.logger.log('createOrder');
    return await this.byteService.requestOrder(
      body.code,
      body.anonymousCode,
      body.nameData,
    );
  }

  @Post('refund')
  async refundOrder(@Body() body: { orderNo: string; refundAmount: number }) {
    this.logger.log('refund');
    return await this.byteService.refundOrder(body.orderNo, body.refundAmount);
  }

  @Post('synchronsize')
  async synchronsizeOrder(
    @Body()
    body: {
      orderId: string;
      status: number;
      code: string;
      anonymousCode: string;
    },
  ) {
    this.logger.log(body);
    this.logger.log('synchronsize');
    const openId = await this.byteService.getOpenId(
      body.code,
      body.anonymousCode,
    );

    await this.byteService.synchronsizeOrder(body.orderId, body.status, openId);
  }

  @Post('tt-callback')
  async ttCallback(
    @Body() body: { version: string; msg: string; type: string },
  ) {
    try {
      this.logger.log('tt-callback');
      this.logger.log(body);
      await this.byteService.ttCallback(
        JSON.parse(body.msg) as unknown as TTPaymentCallback,
      );

      return {
        err_no: 0,
        err_tips: 'success',
      };
    } catch (error) {
      console.error(error);

      return {
        err_no: 1,
        err_tips: 'server error',
      };
    }
  }
}
