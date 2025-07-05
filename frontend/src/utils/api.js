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

const buildUrl = (path) => {
  return `${API_URL}${path.startsWith("/") ? path : "/" + path}`;
};

const api = {
  get: async (path) => {
    const response = await fetch(buildUrl(path), {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
      },
      credentials: "include", // important for cookies
    });
    return handleResponse(response);
  },

  post: async (path, data) => {
    const response = await fetch(buildUrl(path), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return handleResponse(response);
  },

  patch: async (path, data) => {
    const response = await fetch(buildUrl(path), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return handleResponse(response);
  },

  delete: async (path) => {
    const response = await fetch(buildUrl(path), {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(),
      },
      credentials: "include",
    });
    return handleResponse(response);
  },
};

export default api;
