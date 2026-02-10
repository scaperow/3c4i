export interface Order extends NameData {
  orderId: string;
  price: number;
  status: number;
  openId: string;
}

export interface OrderDataRow extends Order {
  _id: string;
}

export interface NameData {
  familyName: string;
  birthday: string;
  gender: string;
  middleName: string;
  style: string;
  personality: string;
  principle: string;
}
