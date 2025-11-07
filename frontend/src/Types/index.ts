export type MyDataItem = {
  code: string;
  name: string;
  price: number;
  cost: number;
  stock: number;
  sold: number;
};

export type SelectedItem = MyDataItem & {
  amount: number;
};

export type TransactionData = {
  timestamp: Date;
  type: string;
  code: string;
  amount: number;
  total: number;
  receive: number;
};

export type TransactionResponse = {
  timestamp: string;
  type: string;
  code: string;
  amount: number;
  total: number;
  receive: number;
};