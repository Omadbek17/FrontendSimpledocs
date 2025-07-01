const API_URL = "https://simpledocsnew.onrender.com/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("access");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  let data;
  if (isJson) {
    data = await response.json();
  }

  if (!response.ok) {
    const message = data?.detail || data?.message || response.statusText;
    throw new Error(message || "An unknown error occurred");
  }

  return data;
};

const api = {
  get: async (path) => {
    const response = await fetch(`${API_URL}${path.startsWith("/") ? path : "/" + path}`, {
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(response);
  },

  post: async (path, data) => {
    const response = await fetch(`${API_URL}${path.startsWith("/") ? path : "/" + path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  patch: async (path, data) => {
    const response = await fetch(`${API_URL}${path.startsWith("/") ? path : "/" + path}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (path) => {
    const response = await fetch(`${API_URL}${path.startsWith("/") ? path : "/" + path}`, {
      method: "DELETE",
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(response);
  },
};

export default api;
