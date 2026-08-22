const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

function getToken() {
  return localStorage.getItem("jurnal_token");
}

export function setToken(token) {
  localStorage.setItem("jurnal_token", token);
}

export function clearToken() {
  localStorage.removeItem("jurnal_token");
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Permintaan gagal (${res.status})`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  authStatus: () => request("/auth/status"),
  setupPin: (pin) => request("/auth/setup", { method: "POST", body: JSON.stringify({ pin }) }),
  login: (pin) => request("/auth/login", { method: "POST", body: JSON.stringify({ pin }) }),
  changePin: (currentPin, newPin) =>
    request("/auth/change-pin", { method: "POST", body: JSON.stringify({ currentPin, newPin }) }),

  listEntries: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/entries${qs ? `?${qs}` : ""}`);
  },
  getEntry: (id) => request(`/entries/${id}`),
  createEntry: (data) => request("/entries", { method: "POST", body: JSON.stringify(data) }),
  updateEntry: (id, data) => request(`/entries/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteEntry: (id) => request(`/entries/${id}`, { method: "DELETE" }),

  stats: () => request("/stats"),
  exportAll: () => request("/export"),
};
