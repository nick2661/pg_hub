/**
 * PG Hub — Mock Data for Dashboard & Screens
 * This will be replaced with real API calls later
 */

export interface Tenant {
  id: string;
  name: string;
  phone: string;
  room: string;
  bed: string;
  propertyId: string;
  propertyName: string;
  monthlyRent: number;
  securityDeposit: number;
  checkInDate: string;
  rentDueDay: number;
  rentStatus: 'paid' | 'pending' | 'overdue' | 'due';
  avatar?: string;
  aadhaarNumber?: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  totalBeds: number;
  occupiedBeds: number;
  monthlyRevenue: number;
  floors: Floor[];
}

export interface Floor {
  id: string;
  name: string;
  rooms: Room[];
}

export interface Room {
  id: string;
  number: string;
  sharingType: number;
  beds: Bed[];
}

export interface Bed {
  id: string;
  label: string;
  status: 'occupied' | 'vacant' | 'due' | 'booked';
  tenantName?: string;
  tenantInitials?: string;
}

export interface PaymentRecord {
  id: string;
  tenantName: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  propertyName: string;
}

export interface ActivityItem {
  id: string;
  type: 'payment' | 'checkin' | 'checkout' | 'reminder';
  title: string;
  subtitle: string;
  timestamp: string;
  icon: string;
}

export interface ExpenseItem {
  category: string;
  amount: number;
  percentage: number;
}

// ─── Mock Data ──────────────────────────────────────────────

export const mockTenants: Tenant[] = [
  {
    id: '1', name: 'Aryan Sharma', phone: '+91 98765 43210',
    room: '302', bed: 'A', propertyId: '1', propertyName: 'Sunshine PG',
    monthlyRent: 12000, securityDeposit: 24000, checkInDate: '2025-03-15',
    rentDueDay: 5, rentStatus: 'paid',
  },
  {
    id: '2', name: 'Priya Gupta', phone: '+91 87654 32109',
    room: '101', bed: 'B', propertyId: '1', propertyName: 'Sunshine PG',
    monthlyRent: 10000, securityDeposit: 20000, checkInDate: '2025-05-01',
    rentDueDay: 5, rentStatus: 'due',
  },
  {
    id: '3', name: 'Rohan Patel', phone: '+91 76543 21098',
    room: '205', bed: 'A', propertyId: '1', propertyName: 'Sunshine PG',
    monthlyRent: 12000, securityDeposit: 24000, checkInDate: '2025-01-10',
    rentDueDay: 5, rentStatus: 'paid',
  },
  {
    id: '4', name: 'Sanya Singh', phone: '+91 65432 10987',
    room: '403', bed: 'B', propertyId: '2', propertyName: 'Green Valley Hostel',
    monthlyRent: 9000, securityDeposit: 18000, checkInDate: '2025-06-20',
    rentDueDay: 7, rentStatus: 'due',
  },
  {
    id: '5', name: 'Akash Varma', phone: '+91 54321 09876',
    room: '112', bed: 'A', propertyId: '2', propertyName: 'Green Valley Hostel',
    monthlyRent: 11000, securityDeposit: 22000, checkInDate: '2025-04-01',
    rentDueDay: 5, rentStatus: 'paid',
  },
  {
    id: '6', name: 'Meera Reddy', phone: '+91 43210 98765',
    room: '201', bed: 'A', propertyId: '3', propertyName: 'City Center PG',
    monthlyRent: 10000, securityDeposit: 20000, checkInDate: '2025-07-15',
    rentDueDay: 7, rentStatus: 'pending',
  },
  {
    id: '7', name: 'Vikram Joshi', phone: '+91 32109 87654',
    room: '305', bed: 'B', propertyId: '3', propertyName: 'City Center PG',
    monthlyRent: 15000, securityDeposit: 30000, checkInDate: '2025-02-01',
    rentDueDay: 1, rentStatus: 'overdue',
  },
  {
    id: '8', name: 'Kavya Nair', phone: '+91 21098 76543',
    room: '104', bed: 'A', propertyId: '1', propertyName: 'Sunshine PG',
    monthlyRent: 8500, securityDeposit: 17000, checkInDate: '2025-08-01',
    rentDueDay: 5, rentStatus: 'paid',
  },
];

export const mockProperties: Property[] = [
  {
    id: '1', name: 'Sunshine PG', address: 'HSR Layout, Bangalore',
    totalBeds: 14, occupiedBeds: 12, monthlyRevenue: 120000,
    floors: [
      {
        id: 'f1', name: 'Ground Floor',
        rooms: [
          { id: 'r1', number: '101', sharingType: 2, beds: [
            { id: 'b1', label: 'A', status: 'occupied', tenantName: 'Priya Gupta', tenantInitials: 'PG' },
            { id: 'b2', label: 'B', status: 'due', tenantName: 'Rahul K', tenantInitials: 'RK' },
          ]},
          { id: 'r2', number: '102', sharingType: 3, beds: [
            { id: 'b3', label: 'A', status: 'occupied', tenantName: 'Karan B', tenantInitials: 'KB' },
            { id: 'b4', label: 'B', status: 'occupied', tenantName: 'Ravi J', tenantInitials: 'RJ' },
            { id: 'b5', label: 'C', status: 'vacant' },
          ]},
          { id: 'r3', number: '103', sharingType: 2, beds: [
            { id: 'b6', label: 'A', status: 'vacant' },
            { id: 'b7', label: 'B', status: 'vacant' },
          ]},
          { id: 'r4', number: '104', sharingType: 2, beds: [
            { id: 'b8', label: 'A', status: 'occupied', tenantName: 'Kavya N', tenantInitials: 'KN' },
            { id: 'b9', label: 'B', status: 'occupied', tenantName: 'Sneha T', tenantInitials: 'ST' },
          ]},
        ],
      },
      {
        id: 'f2', name: '1st Floor',
        rooms: [
          { id: 'r5', number: '201', sharingType: 2, beds: [
            { id: 'b10', label: 'A', status: 'occupied', tenantName: 'Amit S', tenantInitials: 'AS' },
            { id: 'b11', label: 'B', status: 'due', tenantName: 'Neha P', tenantInitials: 'NP' },
          ]},
          { id: 'r6', number: '205', sharingType: 2, beds: [
            { id: 'b12', label: 'A', status: 'occupied', tenantName: 'Rohan Patel', tenantInitials: 'RP' },
            { id: 'b13', label: 'B', status: 'occupied', tenantName: 'Deep M', tenantInitials: 'DM' },
          ]},
        ],
      },
      {
        id: 'f3', name: '2nd Floor',
        rooms: [
          { id: 'r7', number: '302', sharingType: 2, beds: [
            { id: 'b14', label: 'A', status: 'occupied', tenantName: 'Aryan Sharma', tenantInitials: 'AS' },
            { id: 'b15', label: 'B', status: 'occupied', tenantName: 'Vivek R', tenantInitials: 'VR' },
          ]},
        ],
      },
    ],
  },
  {
    id: '2', name: 'Green Valley Hostel', address: 'Koramangala, Bangalore',
    totalBeds: 25, occupiedBeds: 23, monthlyRevenue: 210000,
    floors: [
      {
        id: 'gv_f1', name: 'Ground Floor',
        rooms: [
          { id: 'gv_r1', number: '101', sharingType: 2, beds: [
            { id: 'gv_b1', label: 'A', status: 'occupied', tenantName: 'Akash Varma', tenantInitials: 'AV' },
            { id: 'gv_b2', label: 'B', status: 'occupied', tenantName: 'Sunil M', tenantInitials: 'SM' },
          ]},
          { id: 'gv_r2', number: '102', sharingType: 3, beds: [
            { id: 'gv_b3', label: 'A', status: 'occupied', tenantName: 'Vijay K', tenantInitials: 'VK' },
            { id: 'gv_b4', label: 'B', status: 'occupied', tenantName: 'Nitin S', tenantInitials: 'NS' },
            { id: 'gv_b5', label: 'C', status: 'vacant' },
          ]},
        ],
      },
      {
        id: 'gv_f2', name: '1st Floor',
        rooms: [
          { id: 'gv_r3', number: '201', sharingType: 2, beds: [
            { id: 'gv_b6', label: 'A', status: 'occupied', tenantName: 'Sanya Singh', tenantInitials: 'SS' },
            { id: 'gv_b7', label: 'B', status: 'due', tenantName: 'Ananya D', tenantInitials: 'AD' },
          ]},
          { id: 'gv_r4', number: '202', sharingType: 2, beds: [
            { id: 'gv_b8', label: 'A', status: 'occupied', tenantName: 'Kunal G', tenantInitials: 'KG' },
            { id: 'gv_b9', label: 'B', status: 'occupied', tenantName: 'Harsh P', tenantInitials: 'HP' },
          ]},
        ],
      },
    ],
  },
  {
    id: '3', name: 'City Center PG', address: 'Indiranagar, Bangalore',
    totalBeds: 10, occupiedBeds: 7, monthlyRevenue: 85000,
    floors: [
      {
        id: 'cc_f1', name: 'Ground Floor',
        rooms: [
          { id: 'cc_r1', number: '101', sharingType: 2, beds: [
            { id: 'cc_b1', label: 'A', status: 'occupied', tenantName: 'Meera Reddy', tenantInitials: 'MR' },
            { id: 'cc_b2', label: 'B', status: 'due', tenantName: 'Vikram Joshi', tenantInitials: 'VJ' },
          ]},
          { id: 'cc_r2', number: '102', sharingType: 2, beds: [
            { id: 'cc_b3', label: 'A', status: 'occupied', tenantName: 'Pooja S', tenantInitials: 'PS' },
            { id: 'cc_b4', label: 'B', status: 'vacant' },
          ]},
        ],
      },
      {
        id: 'cc_f2', name: '1st Floor',
        rooms: [
          { id: 'cc_r3', number: '201', sharingType: 2, beds: [
            { id: 'cc_b5', label: 'A', status: 'occupied', tenantName: 'Arjun B', tenantInitials: 'AB' },
            { id: 'cc_b6', label: 'B', status: 'vacant' },
          ]},
          { id: 'cc_r4', number: '202', sharingType: 2, beds: [
            { id: 'cc_b7', label: 'A', status: 'vacant' },
            { id: 'cc_b8', label: 'B', status: 'occupied', tenantName: 'Divya M', tenantInitials: 'DM' },
          ]},
        ],
      },
    ],
  },
];

export const mockPayments: PaymentRecord[] = [
  { id: '1', tenantName: 'Aryan Sharma', amount: 12000, date: 'Oct 5, 11:30 AM', status: 'paid', propertyName: 'Sunshine PG' },
  { id: '2', tenantName: 'Meera Reddy', amount: 10000, date: 'Due Oct 7', status: 'pending', propertyName: 'City Center PG' },
  { id: '3', tenantName: 'Vikram Joshi', amount: 15000, date: 'Due Oct 1', status: 'overdue', propertyName: 'City Center PG' },
  { id: '4', tenantName: 'Rohan Patel', amount: 12000, date: 'Oct 3, 9:00 AM', status: 'paid', propertyName: 'Sunshine PG' },
  { id: '5', tenantName: 'Priya Gupta', amount: 10000, date: 'Due Oct 5', status: 'pending', propertyName: 'Sunshine PG' },
  { id: '6', tenantName: 'Akash Varma', amount: 11000, date: 'Oct 2, 2:15 PM', status: 'paid', propertyName: 'Green Valley Hostel' },
  { id: '7', tenantName: 'Kavya Nair', amount: 8500, date: 'Oct 4, 10:00 AM', status: 'paid', propertyName: 'Sunshine PG' },
  { id: '8', tenantName: 'Sanya Singh', amount: 9000, date: 'Due Oct 7', status: 'pending', propertyName: 'Green Valley Hostel' },
];

export const mockRecentActivity: ActivityItem[] = [
  { id: '1', type: 'payment', title: 'Aryan Sharma', subtitle: 'Rent ₹12,000 paid', timestamp: 'Oct 5, 11:30 AM', icon: 'cash' },
  { id: '2', type: 'checkin', title: 'Priya Singh', subtitle: 'Checked in (Room 302)', timestamp: 'Oct 4, 3:15 PM', icon: 'log-in' },
  { id: '3', type: 'payment', title: 'Karan Patel', subtitle: 'Rent ₹15,000 paid', timestamp: 'Oct 4, 9:00 AM', icon: 'cash' },
  { id: '4', type: 'reminder', title: 'Rent Reminders', subtitle: 'Sent to 5 tenants via WhatsApp', timestamp: 'Oct 3, 10:00 AM', icon: 'chatbubble' },
  { id: '5', type: 'checkout', title: 'Vivek Rao', subtitle: 'Checked out (Room 201)', timestamp: 'Oct 2, 5:00 PM', icon: 'log-out' },
];

export const mockExpenses: ExpenseItem[] = [
  { category: 'Staff Salaries', amount: 60000, percentage: 33 },
  { category: 'Food', amount: 40000, percentage: 22 },
  { category: 'Electricity', amount: 35000, percentage: 19 },
  { category: 'Maintenance', amount: 25000, percentage: 14 },
  { category: 'Others', amount: 20000, percentage: 11 },
];

// Dashboard summary calculations
export const getDashboardSummary = () => {
  const totalTenants = mockTenants.length;
  const totalCollected = mockPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const duesPending = mockPayments.filter(p => p.status !== 'paid').length;
  const totalBeds = mockProperties.reduce((sum, p) => sum + p.totalBeds, 0);
  const occupiedBeds = mockProperties.reduce((sum, p) => sum + p.occupiedBeds, 0);
  const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100);
  const totalRevenue = mockProperties.reduce((sum, p) => sum + p.monthlyRevenue, 0);
  const totalExpenses = mockExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  return {
    totalTenants,
    totalCollected,
    duesPending,
    totalBeds,
    occupiedBeds,
    vacantBeds: totalBeds - occupiedBeds,
    occupancyRate,
    totalRevenue,
    totalExpenses,
    netProfit,
  };
};
