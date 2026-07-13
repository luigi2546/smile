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
  amount_paid_ghs: number;
  session_number: number;
  total_sessions: number;
  shade_before: string | null;
  shade_after: string | null;
  follow_up_date: string | null;
  consent_confirmed: boolean;
  before_photo_path: string | null;
  after_photo_path: string | null;
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

export type SubscriptionStatus = "active" | "paused" | "cancelled" | "expired";

export type SubscriptionPlan = {
  id: string;
  name: string;
  description: string | null;
  price_ghs: number;
  session_count: number;
  features: string[];
  is_active: boolean;
  created_at: string;
};

export type Subscription = {
  id: string;
  customer_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  started_at: string;
  renews_at: string;
  cancelled_at: string | null;
  payment_ref: string | null;
  sessions_total: number;
  sessions_used: number;
  amount_paid_ghs: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type SubscriptionWithRelations = Subscription & {
  customer: Pick<Customer, "id" | "full_name" | "phone"> | null;
  plan: Pick<SubscriptionPlan, "id" | "name" | "price_ghs"> | null;
};
