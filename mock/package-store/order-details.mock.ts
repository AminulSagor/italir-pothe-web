import { IMAGE } from "@/constant/image.path";
import { OrderDetailsMock } from "./order-details.types";

export const orderDetailsMock: OrderDetailsMock = {
  id: "7742",
  orderId: "#ORD-7742",
  status: "Completed",
  transactionDate: "Oct 24, 2023 at 14:45 PM",
  method: "Credit Card",
  totalAmount: "€8.52",
  customer: {
    name: "Alex Rivera",
    email: "alex.rivera@example.com",
    studentId: "SHIKHI-99281",
    avatar: IMAGE.customer,
  },
  package: {
    name: "Fluent Learner AI",
    description:
      "A comprehensive subscription for intermediate Italian learners focusing on conversational AI practice.",
    price: "€6.99 / mo",
    voiceMinutes: "60 Voice Minutes",
    textTokens: "5,000 Text Tokens",
  },
  payment: {
    subtotal: "€6.99",
    tax: "€1.53",
    total: "€8.52",
    method: "Online Payment",
  },
  timeline: [
    {
      id: 1,
      title: "Tokens Credited",
      date: "Oct 24, 2023 • 14:46 PM",
      description: "AI Balance updated successfully for Alex Rivera.",
    },
    {
      id: 2,
      title: "Payment Processed",
      date: "Oct 24, 2023 • 14:45 PM",
      description: "Stripe ID: ch_3NpkZfLzGq7oZ2K",
    },
    {
      id: 3,
      title: "Order Placed",
      date: "Oct 24, 2023 • 14:42 PM",
      description: "Initial checkout session started by student.",
    },
  ],
};
