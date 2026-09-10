const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      ...options.headers,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Admin request failed");
  }

  return data;
};

export const fetchAllUsers = (page = 1, search = "") =>
  request(`/admin/users?page=${page}&search=${encodeURIComponent(search)}`);

export const mutateUserStatus = (userId, updates) =>
  request(`/admin/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });