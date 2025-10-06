// src/service/authApi.ts
import { AxiosHeaders } from "axios";
import { postRequest, getRequest} from "./api";

export interface LoginResponse {
  email(arg0: string, email: any): unknown;
  access_token: string;
  token_type: string;
  role: string;
}

export const loginRequest = async (username: string, password: string) => {
  const body = new URLSearchParams();
  body.append("grant_type", "password");
  body.append("username", username);
  body.append("password", password);

  return postRequest<LoginResponse>("/auth/login", body.toString(), {
    headers: new AxiosHeaders({ "Content-Type": "application/x-www-form-urlencoded" }),
  });
};


export interface UserInfo {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  division?: string;
  status: string;
}

export const loginAndGetUser = async (username: string, password: string): Promise<UserInfo> => {
  // 1️⃣ Login using existing loginRequest
  const loginData = await loginRequest(username, password);

  // Save token to sessionStorage
  sessionStorage.setItem("access_token", loginData.access_token);
  sessionStorage.setItem("role", loginData.role.toUpperCase());

  // 2️⃣ Fetch current logged-in user info
  const userData = await getRequest<UserInfo>("/users/me"); // Axios interceptor adds token automatically

  return userData; // { id, name, email, role, division, status, etc. }
};