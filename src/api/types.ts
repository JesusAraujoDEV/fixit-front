// ─── Roles & Auth ───────────────────────────────────────────────────────────

export type UserRole = "client" | "technician" | "admin";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  phone: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface MeResponse {
  user: User;
}

// ─── Map & Geo ──────────────────────────────────────────────────────────────

export interface GeoParams {
  lat: number;
  lng: number;
  radius_km: number;
}

export interface TechnicianMarker {
  id: string;
  user_id: string;
  full_name: string;
  rating_average: number;
  is_verified: boolean;
  latitude: number;
  longitude: number;
  distance_km: number;
}

export interface RequestMarker {
  id: string;
  position: [number, number];
  label: string;
  type: "request";
  category: string;
}

export interface HeatmapZone {
  id: string;
  center: [number, number];
  radius_m: number;
  intensity: number;
  label: string;
}

// ─── Requests ───────────────────────────────────────────────────────────────

export interface CreateRequestPayload {
  title: string;
  description?: string;
  category: RequestCategory;
  images?: string[];
  latitude: number;
  longitude: number;
}

export type RequestCategory =
  | "plumbing"
  | "electrical"
  | "carpentry"
  | "painting"
  | "appliance_repair"
  | "locksmith"
  | "cleaning"
  | "hvac"
  | "general";

export interface CreateRequestResponse {
  id: string;
  status: "pending";
  created_at: string;
  nearby_technicians_count: number;
  estimated_response_min: number;
}

export type RequestStatus = "active" | "completed" | "cancelled";

export interface ClientRequest {
  id: string;
  title: string;
  category: string;
  status: RequestStatus;
  technician: { name: string } | null;
  created_at: string;
  price: string | null;
  eta_minutes?: number;
}

// ─── Jobs (Technician) ──────────────────────────────────────────────────────

export interface AvailableJob {
  id: string;
  category: string;
  title: string;
  distance_km: number;
  expires_in_min: number;
  payout: string;
  urgent: boolean;
}

export interface CompletedJob {
  id: string;
  title: string;
  earnings: string;
  rating: number;
  completed_at: string;
}

export interface AvailabilityPayload {
  online: boolean;
  lat?: number;
  lng?: number;
}

export interface AvailabilityResponse {
  online: boolean;
  updated_at: string;
}

// ─── Admin ──────────────────────────────────────────────────────────────────

export interface KpiItem {
  value: number | string;
  delta: string;
}

export interface AdminKpis {
  active_services: KpiItem;
  technicians_online: KpiItem;
  revenue_today: KpiItem;
  reports_pending: KpiItem;
}

export interface Transaction {
  id: string;
  client: string;
  technician: string;
  service: string;
  amount: string;
  commission: string;
  status: string;
  created_at: string;
}

export interface TransactionsResponse {
  data: Transaction[];
  total: number;
  page: number;
  per_page: number;
}

export interface TransactionsSummary {
  today_count: number;
  today_volume: string;
  today_commission: string;
  disputes_pending: number;
}

export interface PlatformEvent {
  id: string;
  time: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
}

export interface Verification {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  documents_count: number;
  status: "pending" | "approved" | "rejected";
  submitted_at: string;
}

export interface VerificationAction {
  action: "approve" | "reject";
  reason?: string;
}

export interface WeeklyPerformanceDay {
  label: string;
  completed: number;
  date: string;
}

export interface WeeklyPerformance {
  days: WeeklyPerformanceDay[];
}

// ─── Upload ─────────────────────────────────────────────────────────────────

export interface UploadResponse {
  url: string;
  display_url: string;
  thumbnail_url: string;
  delete_url: string;
  size: number;
  width: number;
  height: number;
  title: string;
  expiration: number | null;
}

// ─── AI ─────────────────────────────────────────────────────────────────────

export interface DiagnoseResponse {
  diagnosis: string;
  confidence: number;
  suggested_category: RequestCategory;
  tags: string[];
}

// ─── WebSocket Events ───────────────────────────────────────────────────────

export interface ConnectionEstablished {
  session_id: string;
  user_id: string;
  role: UserRole;
  joined_rooms: string[];
}

export interface SearchAck {
  search_id: string;
  request_id: string;
  status: "searching";
}

export interface SearchTimeout {
  search_id: string;
}

export interface MissionOffer {
  mission_id: string;
  search_id: string;
  request_id: string;
  client_id: string;
  expires_in_seconds: number;
}

export interface MissionConfirmed {
  mission_id: string;
  status: "confirmed";
}

export interface TrackingUpdate {
  technician_id: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}
