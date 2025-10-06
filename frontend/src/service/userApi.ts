import { postRequest, putRequest, deleteRequest, getRequest} from "./api";

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: string;
  division: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  division?: string;
  status?: "Active" | "Inactive";
}


export interface MeResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  division: string;
  status: string;
}

export const createUserRequest = (payload: CreateUserPayload) => {
  return postRequest("/users/", payload);
};


export const updateUserRequest = (userId: string, payload: UpdateUserPayload) => {
  return putRequest(`/users/${userId}`, payload);
};


export const deleteUserRequest = (userId: string) => {
  return deleteRequest(`/users/${userId}`);
};

export const getMeRequest = (): Promise<MeResponse> => {
  return getRequest("/users/me");
};
