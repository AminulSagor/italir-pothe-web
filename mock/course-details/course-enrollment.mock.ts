import { CourseEnrollmentStudent } from "./course-enrollment.type";

export const courseEnrollmentStudents: CourseEnrollmentStudent[] = [
  {
    id: 1,
    name: "Leonardo Vincipuerra",
    studentId: "#ITA-9921",
    phone: "+39 342 123 4567",
    email: "leonardo.v@example.it",
    amountPaid: "€49.00",
    avatar: "/images/avatar-1.png",
  },
  {
    id: 2,
    name: "Chiara Rossi",
    studentId: "#ITA-9844",
    phone: "+39 331 987 6543",
    email: "chiara.rossi@outlook.com",
    amountPaid: "€49.00",
    avatar: "/images/avatar-2.png",
  },
  {
    id: 3,
    name: "Antonio Moretti",
    studentId: "#ITA-9712",
    phone: "+39 355 554 3210",
    email: "a.moretti@web.it",
    amountPaid: "€49.00",
    avatar: "/images/avatar-3.png",
    isMuted: true,
  },
  {
    id: 4,
    name: "Elena Bianchi",
    studentId: "#ITA-9620",
    phone: "+39 328 111 2233",
    email: "bianchi.elena@domain.it",
    amountPaid: "€49.00",
    avatar: "/images/avatar-4.png",
  },
];
