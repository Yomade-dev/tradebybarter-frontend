export const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Change this to your real login route
export const LOGIN_PATH = "/auth";

// Where your login code saves the token (checked in this order)
const TOKEN_KEYS = ["token", "authToken", "accessToken", "jwt"];

export const getToken = () => {
  for (const store of [localStorage, sessionStorage]) {
    for (const key of TOKEN_KEYS) {
      const value = store.getItem(key);
      if (value) return value;
    }
  }
  return "";
};

export const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const clearSession = () => {
  for (const store of [localStorage, sessionStorage]) {
    [...TOKEN_KEYS, "user"].forEach((key) => store.removeItem(key));
  }
  window.dispatchEvent(new Event("auth:cleared"));
};

export const displayName = (user) =>
  user?.fullName ||
  user?.name ||
  user?.username ||
  [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
  "";
  export const apiJson = async (path, { method = "GET", body } = {}) => {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || "Something went wrong");
  return json;
};