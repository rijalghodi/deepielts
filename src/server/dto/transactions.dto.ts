export type Transaction = {
  id: string;
  status: string;
  amount: string;
  currencyCode?: string;
  invoiceUrl: string;
  createdAt: string;
  description?: string;
  type?: string;
  name: string;
};

export type GetTransactionsResult = {
  hasMore: boolean;
  total: number;
  transactions: Transaction[];
  after?: string;
};
