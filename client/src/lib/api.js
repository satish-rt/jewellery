import axios from "axios";

const rawApiUrl = (import.meta.env.VITE_API_URL || "").trim();
let baseURL = "/api";
if (rawApiUrl) {
  const clean = rawApiUrl.replace(/\/+$/, "");
  baseURL = clean.endsWith("/api") ? clean : `${clean}/api`;
}

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("userToken");
  const url = config.url || "";
  const method = (config.method || "").toLowerCase();

  let token = null;

  // Route-aware token attachment:
  // Admin auth and admin operations prioritize adminToken
  if (url.startsWith("/auth") || url.includes("/admin")) {
    token = adminToken || userToken;
  } else if (url.startsWith("/users")) {
    token = userToken || adminToken;
  } else if (url.startsWith("/enquiries") && method === "post") {
    // Submitting enquiry from customer
    token = userToken || adminToken;
  } else if (url.startsWith("/enquiries")) {
    // Admin reviewing enquiries (GET, PUT, DELETE)
    token = adminToken || userToken;
  } else if (["post", "put", "patch", "delete"].includes(method)) {
    // Catalog management operations require adminToken
    token = adminToken || userToken;
  } else {
    // Default GET or other requests
    token = adminToken || userToken;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Let components handle 401 instead of redirecting globally
    return Promise.reject(error);
  },
);

export default api;
