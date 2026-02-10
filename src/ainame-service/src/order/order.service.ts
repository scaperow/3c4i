import { Logger, Param } from '@nestjs/common';
// byte.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import * as https from 'https';
import { NameData, Order } from './entities/order.entity';
import { dySDK } from '@open-dy/node-server-sdk';
import { get } from 'lodash';
import Client, { V2Jscode2sessionRequest } from '@open-dy/open_api_sdk';
import CredentialClient from '@open-dy/open_api_credential';
import {
  ORDER_STATUS,
  TTPaymentCallback,
  TTPaymentCallbackStatus,
} from './types';
import * as uuid from 'uuid';
import { create } from 'domain';

// 请求时间戳
const timestamp = Math.floor(Date.now() / 1000);
// 开发者填入自己的小程序 app_id
const appId = 'testAppId';
// 随机字符串
const nonceStr = uuid.v4();
// 应用公钥版本
const keyVersion = '1';
// 应用私钥（建议通过安全方式存储和使用，不要直接在代码中明文使用）
const privateKey = `
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEArXi1ErT0NFHKleqSvrEzjOJsqDv3GQO92Y6FFum8t8gYFzfX
ofVT2j87sgJGkPYzf+ZXSJZLCC4xSx5QhWkmrfakxI8I0a6hpmR/0Ij4pkj8FTDO
0TG0G3apEm93/ctvjTK4BX7UVR8jUmfMgIGQqBNKUQpbQHxSlDl38Q2+cpMCHfxR
8uxyygxe/4n6mzPn6/yFTXtqRQY+0pLaObnlls8kJ+xLlwUvM6QZdPdWV5+SimbQ
Y2yVGE2o9xpPVos39//F7aX2gUA+s0uOvNjNdYIhQwJ38pTe5pepGn8THas8ip5X
V8+DvSNc+73wzey/R42zy2HxnO0lJZZpFCNy4wIDAQABAoIBAQCo7ex/vCI4NRJw
rc+bzhqibvlbV5IJFSCzlVu79YDnA/+Z1LKzsKGo3n02m4q2rlt2iQykzl9hJwKv
4WSOltio/pB0Lcprz4Dx9dqWbFygKmD6Dd7Jz3pSaFq7bjvOtmb6fNLB30HNZxZR
sG1xEzuYwbhUdR5qDOeqGtDXuQemsDEkOJeUW1By1QitTn3eocTid3XmmhfOZlQ2
OItpzoXV++i9RwPNz/oqGY0S7ummQJYy39pPf43DBwcg92QbH9/5VoPPXrKvSSXb
AwlR+1EaJ0c1UXc4ZtdfRVJegHwcya1r2K4dE932wIMhHr5n1x0bgdUrTr0EIMTL
4OY1gS3JAoGBAOII5dkJesqGPJAq5BEr/o2XxtCq6qMhVFicvomrMBUd8ifSFjBc
0Mi0J3IT1YHq0l43lLm9TBHvpgAebMmN4ggtWrD4XIlQhpV1Qu5c9lWCmffo6A8r
qhae40a6AFDqTtB75aSyV4rGpOXqX8zlt1Izp8B4bgZGyxKj6mGT7cTtAoGBAMR3
7u0vb6gOQ5kF1kU4/oV8FXxr6q4Azw3qRWBY+QfkojfqzU4vw61dJ/K+iI8L2n3j
LiIXbrS8MkhbRupSrdG6RvElfdpaCZaMpWAjiY0wvQDdRXWkO1tKcxQ+PGT/tZtQ
yjP0/br+vTmhJXi++rO5jszOyJStuhkIwUjOTG0PAoGBAKmTQVT9fqiX4rHJ68ZS
Oivh9R8xSszNwWilV3ETBASjrbtgKpNn3p7kQT+dT62jDOXwTty1/m7qWqB2MulX
T38Q/5wLB+lgh0dzbJ5FEe1/CKHrksVm3bkQxLOX8YrC7hQND3Dq9zA+7REsL2kZ
4dmCtVR5RRniXJGEdd90yonVAoGANBAwMYxrg1ZcVXW1hVyIHil2rCUQ6JFwTRiy
z8hkHdJZpoXDaB/CM/PGvU3+dCHJAaktNX2OKbjhfkkp7riANV6upAKyaiWH+uxE
esiQD+lFfLAmUvl1fUiqXEftyzn0DzeGjeQzRNVyoY3xlyDM4MmgbOezQasT8MRg
LAH3QMMCgYB6nPKehi84KBnm3E/xS/lo3s/okaIZDOKbI99VuhIRdpIRyx9Z564E
vLn/7Eq64jlEV0ZmJp8xBBrL+y7lrYVIJ8Zi0XlXybj03qzcAzBZuyCCflDUg1Gx
bL+RNxIxROMmnnoK2HqnJ24NH7kMX3gWxF4go4eFU+NvmKAl/1WvKw==
-----END RSA PRIVATE KEY-----
`.replace(/\\n/gm, '\n');

let lastOrderTime = 0;
let lastOrderOffset = 0;
@Injectable()
export class OrderService {
  database = dySDK.database();

  http = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  });

  // 请求的URL
  private completionsUrl;
  // 授权令牌，替换为实际有效的值
  private bearerToken;
  private app_id;
  private secret;
  private merchant_id;
  private salt;
  private notify_url;
  private payUrl =
    'https://developer.toutiao.com/api/apps/ecpay/v1/create_order';
  private refundUrl =
    'https://developer.toutiao.com/api/apps/ecpay/v1/create_refund';
  private tokenUrl = 'https://developer.toutiao.com/api/apps/v2/token';
  private modelName;
  private price = 990;
  private orderCenterUrl =
    'https://developer.toutiao.com/api/apps/order/v2/push';

  private REQUEST_NOT_NEED_SIGN_PARAMS = [
    'app_id',
    'thirdparty_id',
    'sign',
    'other_settle_params',
  ];

  logger: Logger = new Logger(OrderService.name, { timestamp: true });

  constructor(private readonly configService: ConfigService) {
    this.app_id = this.configService.get<string>('APP_ID');
    this.secret = this.configService.get<string>('SECRET');
    this.merchant_id = this.configService.get<string>('MERCHANT_ID');
    this.salt = this.configService.get<string>('SALT');
    this.notify_url = this.configService.get<string>('TT_PAY_NOTIFY_URL');
    this.database.config = {
      envID: this.configService.get<string>('DB_ENV_ID'),
    };
    this.completionsUrl = this.configService.get<string>('COMPLETION_URL');
    this.bearerToken = this.configService.get<string>('BEARER_TOKEN');
    this.modelName = this.configService.get<string>('MODEL_NAME');
    this.price = Number(this.configService.get<string>('PRICE')) || this.price;
    this.orderCenterUrl =
      this.configService.get<string>('ORDER_CENTER_URL') || this.orderCenterUrl;
  }

  generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const randomPart = crypto.randomBytes(4).toString('hex');
    return `${timestamp}-${randomPart}`;
  }

  async getToken(): Promise<string> {
    try {
      const response = await this.http.post(this.tokenUrl, {
        grant_type: 'client_credential',
        appid: this.app_id,
        secret: this.secret,
      });
      return response.data.data.access_token;
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to get token', HttpStatus.BAD_REQUEST);
    }
  }

  createOrderId() {
    const orderTime = new Date().getTime();
    const offset = orderTime === lastOrderTime ? lastOrderOffset++ : 0;

    if (offset === 0) {
      lastOrderOffset = 0;
      lastOrderTime = orderTime;
    }

    return (
      orderTime.toString() + '' + String(offset.toString()).padStart(2, '0')
    );
  }

  async createOrder(order: Order) {
    const database = await dySDK.database();
    const res = await database.collection('order').add({
      ...order,
    });
    await this.synchronsizeOrder(order.orderId, order.status, order.openId);

    return res.id;
  }

  getPaymentToken(order: Order) {
    const timestamp = new Date().getTime();
    const nonceStr = new Date().getTime().toString();
    const data = JSON.stringify({
      // payNotifyUrl: this.notify_url,
      skuList: [
        {
          skuId: '2',
          price: order.price,
          quantity: 1,
          title: '起名服务费-单次永久可用',
          imageList: [
            'https://ainame-oss.oss-cn-beijing.aliyuncs.com/logo.png',
          ],
          type: 301,
          tagGroupId: 'tag_group_7272625659888058380',
        },
      ],
      outOrderNo: order.orderId,
      totalAmount: order.price,
      limitPayWayList: [],
      payExpireSeconds: 3000,
      orderEntrySchema: {
        path: 'page/index/index',
        params: JSON.stringify({
          order_id: order.orderId,
        }),
      },
    });

    const byteAuthorization = this.getByteAuthorization(
      privateKey,
      data,
      this.app_id,
      nonceStr,
      timestamp,
      '1',
    );

    return { data, byteAuthorization };
  }

  async requestOrder(code: string, anonymousCode: string, nameData: NameData) {
    const openId = await this.getOpenId(code, anonymousCode);
    const order: Order = {
      orderId: this.createOrderId(),
      price: this.price,
      status: ORDER_STATUS.WAIT_PAY,
      openId: openId,
      ...nameData,
    };
    // const orderId = await this.createOrder(order);
    const { data, byteAuthorization } = this.getPaymentToken(order);

    return {
      order: order,
      orderToken: data,
      byteAuthorization: byteAuthorization,
    };
  }

  async refundOrder(orderNo: string, refundAmount: number) {
    const params = {
      app_id: this.app_id,
      out_order_no: orderNo,
      refund_amount: refundAmount,
      notify_url: this.notify_url,
      valid_time: 6000,
    };
    params['sign'] = this.requestSignPay(params);

    try {
      const response = await this.http.post(this.refundUrl, params, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error: any) {
      throw new HttpException('Failed to refund order', HttpStatus.BAD_REQUEST);
    }
  }

  requestSignPay(paramsMap) {
    const paramsArr = [];

    // 遍历所有参数，过滤掉不参与签名的参数
    for (const [key, value] of Object.entries(paramsMap)) {
      if (this.REQUEST_NOT_NEED_SIGN_PARAMS.includes(key)) continue;

      let val = value.toString().trim();
      if (val.startsWith('"') && val.endsWith('"') && val.length > 1) {
        val = val.slice(1, -1).trim(); // 去掉头尾引号并去除空格
      }
      if (val !== '' && val !== 'null') {
        paramsArr.push(val);
      }
    }

    paramsArr.push(this.salt); // 加入盐值
    paramsArr.sort(); // 按字典排序

    // 拼接成字符串
    const signStr = paramsArr.join('&');
    return this.md5FromStr(signStr); // 生成 MD5 签名
  }

  /**
   * 担保支付回调签名算法
   * @param {Array<string>} params - 所有字段内容与平台配置的 token
   * @returns {string} - 签名字符串
   */
  callSignCallback(params) {
    try {
      const concat = params.sort().join(''); // 按字典排序并连接
      return crypto.createHash('sha1').update(concat, 'utf8').digest('hex'); // 生成 SHA1 签名
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  /**
   * md5FromStr - 生成 MD5 签名
   * @param {string} inStr - 需要签名的字符串
   * @returns {string} - 签名字符串
   */
  md5FromStr(inStr) {
    return crypto.createHash('md5').update(inStr, 'utf8').digest('hex');
  }

  async getOpenId(clientCode: string, anonymousCode: string) {
    const client = new Client({
      clientKey: this.app_id,
      clientSecret: this.secret,
    });

    // 改成自己的app_id跟secret
    /* 构建请求参数，该代码示例中只给出部分参数，请用户根据需要自行构建参数值
        token:
           1.若用户自行维护token,将用户维护的token赋值给该参数即可
           2.SDK包中有获取token的函数，请根据接口path在《OpenAPI SDK 总览》文档中查找获取token函数的名字
             在使用过程中，请注意token互刷问题
        header:
           sdk中默认填充content-type请求头，若不需要填充除content-type之外的请求头，删除该参数即可
    */
    const params = new V2Jscode2sessionRequest({
      anonymousCode: anonymousCode,
      appid: this.app_id,
      code: clientCode,
      secret: this.secret,
    });
    // 调用方法发起请求
    const messageRes = await client.v2Jscode2session(params);

    return messageRes.data.openid;
  }

  async ttCallback(body: TTPaymentCallback) {
    this.logger.log(body);

    const database = await dySDK.database();
    const res = await database
      .collection('order')
      .where({ orderId: body.out_order_no })
      .get();
    const order = get(res.data, 0) as Order;

    this.logger.log(order);

    if (!order) {
      throw new HttpException('Order not found', HttpStatus.BAD_REQUEST);
    }

    switch (body.status) {
      case TTPaymentCallbackStatus.SUCCESS:
        await this.updateOrder(body.out_order_no, {
          status: ORDER_STATUS.SUCCESS,
        });
        await this.synchronsizeOrder(body.out_order_no, 1, order.openId);
        break;

      case TTPaymentCallbackStatus.CANCEL:
        await this.updateOrder(body.out_order_no, {
          status: ORDER_STATUS.CANCELLED,
        });
        await this.synchronsizeOrder(body.out_order_no, 2, order.openId);
        break;
    }
  }

  async updateOrder(orderId: string, orderData: Partial<Order>) {
    const database = await dySDK.database();

    await database
      .collection('order')
      .where({ orderId: orderId })
      .update({
        ...orderData,
      });
  }

  async synchronsizeOrder(orderId: string, status: number, openId: string) {
    const accessToken = await this.getToken();
    const entrySchema = JSON.stringify({
      app_id: this.app_id,
      path: 'pages/showup/index',
      params: {
        orderId: orderId,
      },
    });

    const orderDetail = JSON.stringify({
      ext_order_id: orderId,
      status: status,
      shop_name: '星系网络',
      entry_type: 2,
      entry_schema: entrySchema,
    });

    const payload = {
      access_token: accessToken,
      app_name: 'douyin',
      open_id: openId,
      order_detail: orderDetail,
    };

    return this.http.post(this.orderCenterUrl, payload);
  }

  // // 生成的 data 数据
  // const data = JSON.stringify({
  //   skuList: [
  //     {
  //       skuId: "1",
  //       price: 9999,
  //       quantity: 1,
  //       title: "标题",
  //       imageList: ["https://dummyimage.com/234x60"],
  //       type: 401,
  //       tagGroupId: "idxxx",
  //     },
  //   ],
  //   outOrderNo: "1213",
  //   totalAmount: 9999,
  //   limitPayWayList: [],
  //   payExpireSeconds: 3000,
  //   orderEntrySchema: {
  //     path: "page/index/index",
  //     params: '{"poi":"6601248937917548558","aweme_useTemplate":1}',
  //   },
  // });

  // 生成签名
  getSignature(privateKey, method, uri, timestamp, nonce, data) {
    const rawStr = `${method}\n${uri}\n${timestamp}\n${nonce}\n${data}\n`;
    // console.log('Raw String for Signature:\n', rawStr);
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(rawStr, 'utf8');
    // console.log(privateKey);
    return sign.sign(privateKey, 'base64');
  }

  // 生成 byteAuthorization
  getByteAuthorization(
    privateKey,
    data,
    appId,
    nonceStr,
    timestamp,
    keyVersion,
  ) {
    const method = 'POST';
    const uri = '/requestOrder';
    const signature = this.getSignature(
      privateKey,
      method,
      uri,
      timestamp,
      nonceStr,
      data,
    );

    return `SHA256-RSA2048 appid=${appId},nonce_str=${nonceStr},timestamp=${timestamp},key_version=${keyVersion},signature=${signature}`;
  }
}
