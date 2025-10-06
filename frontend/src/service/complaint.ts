import { postRequest, getRequest } from "./api";

// Evidence/Proof file type
export interface ProofFile {
  file_name: string;
  file_url?: string;
  file_type?: string;
}

// Complaint assignment type
export interface Assignment {
  group: string;
  assigned_by: string;
  worker_id: string;
  status: string;
  assigned_at: string;
  sla_deadline: string;
  retries: number;
  proof_files: ProofFile[];
  verified_by?: string;
  submitted_at?: string;
  verified_at?: string;
  escalate_reason?: string;
  final_note?: string;
}

// Complaint type including full details
export interface ComplaintPayload {
  id: string;
  group?: string;
  full_name: string;
  mobile_number: string;
  email?: string;
  complaint_category: string;
  complaint_subject: string;
  detailed_description: string;
  location: { lat: number; lng: number };
  complete_address: string;
  evidence_files: ProofFile[];
  status: string;
  user_id: string;
  created_at: string;
  assignments: Assignment[];
  current_assignment?: Assignment;
}


export interface CreateComplaintPayload {
  full_name: string;
  mobile_number: string;
  email?: string;
  complaint_category: string;
  complaint_subject: string;
  detailed_description: string;
  complete_address: string;
  location: { lat: number; lng: number };
  evidence_files: ProofFile[];
}

// Assign complaint payload
export interface AssignComplaintPayload {
  group?: string;
  worker_user_id?: string;
  remarks?: string;
  sla_minutes?: number;
}

// Assign complaint response
export interface AssignComplaintResponse {
  message: string;
  complaint: ComplaintPayload;
  available_workers?: Worker[];
}

// Worker types
export interface Worker {
  id: string;
  full_name: string;
  role: string;
  available: boolean;
  last_assigned_at: string;
  created_at: string;
  max_tasks?: number;
  active_tasks?: number;
  can_take_more?: boolean;
}

export interface CreateWorkerPayload {
  full_name: string;
  role: string;
}

// API requests
export const createComplaint = (payload: CreateComplaintPayload) =>
  postRequest("/complaint/", payload);

export const getComplaints = () =>
  getRequest<ComplaintPayload[]>("/complaint/");

// Assign complaint response
export const assignComplaint = (
  complaint_id: string,
  payload: AssignComplaintPayload
) => postRequest<AssignComplaintResponse>(`/complaint/${complaint_id}/assign`, payload);

export const getWorkers = () => getRequest<Worker[]>("/worker/");

export const createWorker = (payload: CreateWorkerPayload) =>
  postRequest<Worker>("/worker/", payload);




