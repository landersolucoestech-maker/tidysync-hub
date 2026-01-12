// Centralized data store for the system
// This file exports all mock data that can be shared across pages

export interface CustomerAddress {
  name: string;
  address: string;
  notes: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  phone2: string;
  address: string;
  addresses: CustomerAddress[];
  status: string;
  lastService: string;
  totalJobs: number;
  revenue: string;
  rating: number;
  frequency: string;
  preferredDay: string;
  paymentMethod: string;
  customerSince: string;
  additionalInfo: string;
}

export const customers: Customer[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "(555) 123-4567",
    phone2: "(555) 234-5678",
    address: "123 Oak Street, Springfield",
    addresses: [
      { name: "Home", address: "123 Oak Street, Springfield", notes: "Gate code: 1234. Ring doorbell twice." },
      { name: "Work", address: "456 Corporate Blvd, Springfield", notes: "Park in visitor lot. Check in at front desk." }
    ],
    status: "Active",
    lastService: "2024-01-10",
    totalJobs: 24,
    revenue: "$2,400",
    rating: 5,
    frequency: "Weekly",
    preferredDay: "Monday",
    paymentMethod: "QuickBooks",
    customerSince: "2022-03-15",
    additionalInfo: "Prefers morning appointments. Has two dogs."
  },
  {
    id: 2,
    name: "Tech Startup Inc.",
    email: "office@techstartup.com",
    phone: "(555) 987-6543",
    phone2: "",
    address: "456 Business Park Drive",
    addresses: [
      { name: "Office", address: "456 Business Park Drive", notes: "Use service entrance on the back." }
    ],
    status: "Active",
    lastService: "2024-01-08",
    totalJobs: 12,
    revenue: "$3,600",
    rating: 4,
    frequency: "Every 2 Weeks",
    preferredDay: "Wednesday",
    paymentMethod: "Check",
    customerSince: "2023-01-10",
    additionalInfo: "Contact reception upon arrival."
  },
  {
    id: 3,
    name: "Miller Family",
    email: "miller.family@email.com",
    phone: "(555) 456-7890",
    phone2: "(555) 567-8901",
    address: "789 Maple Avenue, Downtown",
    addresses: [
      { name: "Home", address: "789 Maple Avenue, Downtown", notes: "" }
    ],
    status: "Inactive",
    lastService: "2023-12-15",
    totalJobs: 8,
    revenue: "$800",
    rating: 5,
    frequency: "Monthly",
    preferredDay: "Friday",
    paymentMethod: "Venmo",
    customerSince: "2021-06-20",
    additionalInfo: ""
  },
];

export const jobs = [
  {
    id: "JOB-001",
    customer: "Sarah Johnson",
    service: "Deep Clean",
    date: "2024-01-15",
    time: "09:00 AM",
    staff1: "Maria Silva",
    staff2: "Ana Garcia",
    status: "completed",
    duration: "3h",
    amount: "$180",
    address: "123 Oak Street",
  },
  {
    id: "JOB-002",
    customer: "Tech Startup Inc.",
    service: "Regular Clean",
    date: "2024-01-15",
    time: "01:00 PM",
    staff1: "John Doe",
    staff2: "",
    status: "in-progress",
    duration: "2h",
    amount: "$120",
    address: "456 Business Park",
  },
  {
    id: "JOB-003",
    customer: "Miller Family",
    service: "Move-out Clean",
    date: "2024-01-16",
    time: "10:00 AM",
    staff1: "Ana Garcia",
    staff2: "Carlos Santos",
    status: "scheduled",
    duration: "4h",
    amount: "$280",
    address: "789 Maple Avenue",
  },
];

export const invoices = [
  {
    id: "INV-001",
    customer: "Sarah Johnson",
    amount: "$180.00",
    date: "2024-01-15",
    dueDate: "2024-01-30",
    status: "paid",
    jobId: "JOB-001",
  },
  {
    id: "INV-002",
    customer: "Tech Startup Inc.",
    amount: "$120.00",
    date: "2024-01-15",
    dueDate: "2024-02-15",
    status: "sent",
    jobId: "JOB-002",
  },
  {
    id: "INV-003",
    customer: "Miller Family",
    amount: "$280.00",
    date: "2024-01-10",
    dueDate: "2024-01-25",
    status: "payment_pending",
    jobId: "JOB-003",
  },
  {
    id: "INV-004",
    customer: "Downtown Office Complex",
    amount: "$450.00",
    date: "2024-01-20",
    dueDate: "2024-02-05",
    status: "overdue",
    jobId: "JOB-004",
  },
  {
    id: "INV-005",
    customer: "Green Valley Apartments",
    amount: "$325.00",
    date: "2024-01-22",
    dueDate: "2024-02-07",
    status: "complete",
    jobId: "JOB-005",
  },
];

export const estimates = [
  {
    id: "EST-001",
    customer: "Sarah Johnson",
    service: "Deep Clean",
    amount: "$180.00",
    date: "2024-01-12",
    expiryDate: "2024-02-12",
    status: "approved",
    address: "123 Oak Street",
  },
  {
    id: "EST-002",
    customer: "Tech Startup Inc.",
    service: "Weekly Office Clean",
    amount: "$450.00",
    date: "2024-01-14",
    expiryDate: "2024-02-14",
    status: "pending",
    address: "456 Business Park",
  },
  {
    id: "EST-003",
    customer: "Miller Family",
    service: "Move-out Clean",
    amount: "$280.00",
    date: "2024-01-08",
    expiryDate: "2024-01-08",
    status: "expired",
    address: "789 Maple Avenue",
  },
  {
    id: "EST-004",
    customer: "Downtown Restaurant",
    service: "Commercial Clean",
    amount: "$320.00",
    date: "2024-01-13",
    expiryDate: "2024-02-13",
    status: "pending",
    address: "321 Main Street",
  },
  {
    id: "EST-005",
    customer: "Lisa Anderson",
    service: "Standard Cleaning",
    amount: "$120.00",
    date: "2024-01-15",
    expiryDate: "2024-02-15",
    status: "draft",
    address: "555 Pine Road",
  },
];

export const schedule = [
  {
    id: 1,
    time: "09:00 AM",
    customer: "Sarah Johnson",
    address: "123 Oak Street",
    service: "Deep Cleaning",
    staff: "Maria Silva",
    status: "scheduled",
    duration: "3 hours",
  },
  {
    id: 2,
    time: "01:00 PM",
    customer: "Tech Startup Inc.",
    address: "456 Business Park",
    service: "Regular Cleaning 2weeks",
    staff: "John Doe",
    status: "in-progress",
    duration: "2 hours",
  },
  {
    id: 3,
    time: "04:00 PM",
    customer: "Miller Family",
    address: "789 Maple Avenue",
    service: "Deep Move-Out Cleaning",
    staff: "Ana Garcia",
    status: "completed",
    duration: "4 hours",
  },
  {
    id: 4,
    time: "10:00 AM",
    customer: "Emma Wilson",
    address: "987 Cedar Court",
    service: "Regular Cleaning 3weeks",
    staff: "Maria Silva",
    status: "scheduled",
    duration: "2 hours",
  },
  {
    id: 5,
    time: "02:00 PM",
    customer: "David Johnson",
    address: "321 Pine Road",
    service: "Regular Cleaning 4weeks",
    staff: "Carlos Santos",
    status: "scheduled",
    duration: "2 hours",
  },
  {
    id: 6,
    time: "08:00 AM",
    customer: "Lisa Chen",
    address: "369 Birch Avenue",
    service: "Regular Cleaning weekly",
    staff: "Joana Costa",
    status: "in-progress",
    duration: "2 hours",
  },
  {
    id: 7,
    time: "11:00 AM",
    customer: "Michael Brown",
    address: "963 Spruce Drive",
    service: "Regular Cleaning 3times a week",
    staff: "Carla Oliveira",
    status: "scheduled",
    duration: "1.5 hours",
  },
  {
    id: 8,
    time: "03:00 PM",
    customer: "Ana Garcia",
    address: "123 Oak Street",
    service: "Once a Month",
    staff: "Paula Ferreira",
    status: "completed",
    duration: "3 hours",
  },
  {
    id: 9,
    time: "09:30 AM",
    customer: "Carlos Santos",
    address: "789 Maple Lane",
    service: "Clean Extra",
    staff: "Lucia Pereira",
    status: "scheduled",
    duration: "1 hour",
  },
  {
    id: 10,
    time: "01:30 PM",
    customer: "Sean Eldridge",
    address: "8227 Lake Norman Pl",
    service: "Cleaning For Reason",
    staff: "Rosa Almeida",
    status: "in-progress",
    duration: "2 hours",
  },
  {
    id: 11,
    time: "10:30 AM",
    customer: "John Doe",
    address: "147 Elm Street",
    service: "Deep Move-in Cleaning",
    staff: "Clara Rodrigues",
    status: "scheduled",
    duration: "4 hours",
  },
  {
    id: 12,
    time: "02:30 PM",
    customer: "Sarah Miller",
    address: "159 Ash Lane",
    service: "Once Every 2 Months",
    staff: "Maria Silva",
    status: "completed",
    duration: "3 hours",
  },
  {
    id: 13,
    time: "04:30 PM",
    customer: "Emma Wilson",
    address: "987 Cedar Court",
    service: "Regular Cleaning 8weeks",
    staff: "Ana Santos",
    status: "scheduled",
    duration: "2 hours",
  },
];

export const staff = [
  { id: 1, name: "Maria Silva", role: "Cleaner", status: "Active" },
  { id: 2, name: "John Doe", role: "Cleaner", status: "Active" },
  { id: 3, name: "Ana Garcia", role: "Cleaner", status: "Active" },
  { id: 4, name: "Carlos Santos", role: "Cleaner", status: "Active" },
  { id: 5, name: "Joana Costa", role: "Cleaner", status: "Active" },
  { id: 6, name: "Carla Oliveira", role: "Cleaner", status: "Active" },
  { id: 7, name: "Paula Ferreira", role: "Cleaner", status: "Active" },
  { id: 8, name: "Lucia Pereira", role: "Cleaner", status: "Active" },
  { id: 9, name: "Rosa Almeida", role: "Cleaner", status: "Active" },
  { id: 10, name: "Clara Rodrigues", role: "Cleaner", status: "Active" },
  { id: 11, name: "Ana Santos", role: "Cleaner", status: "Active" },
  { id: 12, name: "Admin User", role: "Admin", status: "Active" },
];

// Helper function to calculate total revenue from invoices
export const calculateTotalRevenue = () => {
  return invoices
    .filter((inv) => inv.status === "paid" || inv.status === "complete")
    .reduce((sum, inv) => {
      const amount = parseFloat(inv.amount.replace("$", "").replace(",", ""));
      return sum + amount;
    }, 0);
};

// Helper to get unique staff members from schedule
export const getUniqueStaff = () => {
  return [...new Set(schedule.map((s) => s.staff))];
};
