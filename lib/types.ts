export type Branch = {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  lat: number | null;
  lng: number | null;
  is_active: boolean;
  created_at: string;
};

export type Service = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price_ghs: number;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
};

export type Customer = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  preferred_branch_id: string | null;
  date_of_birth: string | null;
  is_member: boolean;
  membership_started_at: string | null;
  notes: string | null;
  referred_by_customer_id: string | null;
  created_at: string;
};

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export type Appointment = {
  id: string;
  customer_id: string;
  service_id: string;
  branch_id: string;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  price_ghs: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type AppointmentWithRelations = Appointment & {
  customer: Pick<Customer, "id" | "full_name" | "phone" | "email"> | null;
  service: Pick<Service, "id" | "name" | "price_ghs" | "duration_minutes"> | null;
  branch: Pick<Branch, "id" | "name"> | null;
};

export type ReminderType =
  | "follow_up"
  | "recall_cleaning"
  | "birthday"
  | "membership_renewal"
  | "custom";

export type Reminder = {
  id: string;
  customer_id: string;
  type: ReminderType;
  due_date: string;
  message: string | null;
  is_sent: boolean;
  created_at: string;
};

export type StaffProfile = {
  id: string;
  full_name: string;
  role: "admin" | "branch_manager" | "staff";
  branch_id: string | null;
  created_at: string;
};
