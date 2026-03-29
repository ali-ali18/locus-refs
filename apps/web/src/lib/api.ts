import axios from "axios";

let _workspaceId = "";

export function setWorkspaceId(id: string) {
  _workspaceId = id;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (_workspaceId) config.headers["x-workspace-id"] = _workspaceId;
  return config;
});
