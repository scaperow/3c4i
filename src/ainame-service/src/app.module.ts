import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SessionModule } from './session/session.module';
import { OrderModule } from './order/order.module';
import { ConfigModule } from '@nestjs/config';
import { CallbackModule } from './callback/callback.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SessionModule,
    OrderModule,
    CallbackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
