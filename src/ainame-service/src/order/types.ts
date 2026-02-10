export enum TTPaymentCallbackStatus {
  SUCCESS = 'SUCCESS',
  CANCEL = 'CANCEL',
}

export enum TTPayCancelReason {
  USER_CANCEL = 'USER_CANCEL',
  TIME_OUT = 'TIME_OUT',
}

export const enum ORDER_STATUS {
  WAIT_PAY = 0,
  SUCCESS = 1,
  CANCELLED = 2,
  REFUSED = 6,
}

export interface TTPaymentCallback {
  appid: string; // 当前交易发起的小程序id
  out_order_no: string; // 开发者侧的订单号
  status: string; // 交易状态
  order_id: string; //内部订单号
}
