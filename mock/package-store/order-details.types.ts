export interface OrderDetailsMock {
  id: string;
  orderId: string;
  status: string;
  transactionDate: string;
  method: string;
  totalAmount: string;
  customer: {
    name: string;
    email: string;
    studentId: string;
    avatar: string;
  };
  package: {
    name: string;
    description: string;
    price: string;
    voiceMinutes: string;
    textTokens: string;
  };
  payment: {
    subtotal: string;
    tax: string;
    total: string;
    method: string;
  };
  timeline: {
    id: number;
    title: string;
    date: string;
    description: string;
  }[];
}
