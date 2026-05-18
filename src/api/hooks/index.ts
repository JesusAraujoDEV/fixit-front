// Auth
export { useLogin, useSession, useLogout, authKeys } from "./useAuth";
export { useRegister } from "./useRegister";
export type { RegisterPayload, RegisterClientPayload, RegisterTechnicianPayload } from "./useRegister";

// Map & Geo
export {
  useRequestMarkers,
  useTechnicianMarkers,
  useHeatmapZones,
  mapKeys,
} from "./useMap";

// Requests & Upload
export {
  useCreateRequest,
  useMyRequests,
  useUploadImage,
  useAiDiagnose,
  requestKeys,
} from "./useRequests";

// Jobs (Technician)
export {
  useAvailableJobs,
  useCompletedJobs,
  useToggleAvailability,
  jobKeys,
} from "./useJobs";

// Admin
export {
  useKpis,
  useTransactions,
  useTransactionsSummary,
  useEvents,
  useVerifications,
  useReviewVerification,
  useWeeklyPerformance,
  adminKeys,
} from "./useAdmin";

// WebSocket — Real-time
export { useRadarSearch } from "./useRadarSearch";
export type { RadarStatus } from "./useRadarSearch";

export { useMissionAlerts } from "./useMissionAlerts";
export type { MissionStatus } from "./useMissionAlerts";

export { useTracking } from "./useTracking";
