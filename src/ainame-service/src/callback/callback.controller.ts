import { Controller, Post } from '@nestjs/common';
import { CallbackService } from './callback.service';

@Controller('callback')
export class CallbackController {
  constructor(private readonly callbackService: CallbackService) { }
  
  @Post('tt-pay-notify')
  ttPayNotify() {
    // return this.callbackService.ttPayNotify();
  }
}
