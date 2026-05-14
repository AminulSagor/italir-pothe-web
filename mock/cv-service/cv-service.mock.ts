import { IMAGE } from "@/constant/image.path";

export const cvStats = [
  {
    title: "Total CV Revenue",
    value: "€4,250",
    badge: "+15% VS LAST MONTH",
    dark: true,
  },
  {
    title: "Total CVs Generated",
    value: "12,400",
    badge: "+8% INCREASE",
  },
  {
    title: "Free Credits Used",
    value: "8,500",
    badge: "68% UTILIZATION",
  },
  {
    title: "Paid Credit Refills",
    value: "1,250",
    badge: "+12.5% GROWTH",
  },
];

export const cvTransactions = [
  {
    orderId: "#CV-90210",
    user: "Jane Doe",
    initials: "JD",
    packageName: "Premium Pro",
    amount: "€24.99",
    date: "Oct 24, 2023",
    status: "Completed",
  },
  {
    orderId: "#CV-90211",
    user: "Marcus Smith",
    initials: "MS",
    packageName: "Standard Plus",
    amount: "€12.50",
    date: "Oct 24, 2023",
    status: "Completed",
  },
  {
    orderId: "#CV-90212",
    user: "Laura Bennett",
    initials: "LB",
    packageName: "Credit Refill",
    amount: "€5.00",
    date: "Oct 23, 2023",
    status: "Failed",
  },
  {
    orderId: "#CV-90213",
    user: "Thomas Wright",
    initials: "TW",
    packageName: "Executive Bundle",
    amount: "€49.99",
    date: "Oct 23, 2023",
    status: "Pending",
  },
];

export const cvTemplates = [
  {
    id: 1,
    title: "The Modern...",
    category: "Restaurant",
    plan: "Free",
    image: IMAGE.cv_templete,
    status: "Active",
  },
  {
    id: 2,
    title: "Silicon Valley...",
    category: "Tech Lead",
    plan: "Premium",
    image: IMAGE.cv_templete,
    status: "Active",
  },
  {
    id: 3,
    title: "The Boardroom...",
    category: "Executive",
    plan: "Free",
    image: IMAGE.cv_templete,
    status: "Hidden",
  },
];

export const cvCreditPackages = [
  {
    id: 1,
    name: "Single Refill",
    credits: 1,
    price: "0.99",
    badge: null,
    active: false,
  },
  {
    id: 2,
    name: "Pro Hunter Pack",
    credits: 5,
    price: "2.99",
    badge: "Best Value",
    active: true,
  },
  {
    id: 3,
    name: "Career Sprint Pack",
    credits: 10,
    price: "4.99",
    badge: null,
    active: false,
  },
];
