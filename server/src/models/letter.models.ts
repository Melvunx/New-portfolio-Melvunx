export interface Letter {
  id: number;
  sender: string;
  object: string;
  email: string;
  message: string;
  sendAt: Date;
  account_id?: number;
}
