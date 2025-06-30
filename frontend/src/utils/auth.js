// src/utils/auth.js

export async function fetchWithAuth(url, options = {}) {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");
  
    let response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
    });
  
    if (response.status === 401 && refresh) {
      const refreshRes = await fetch("http://localhost:8000/api/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
  
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        localStorage.setItem("access", data.access);
  
        response = await fetch(url, {
          ...options,
          headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${data.access}`,
            "Content-Type": "application/json",
          },
        });
      } else {
        // ❗ Token refresh failed – redirect to login
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        alert("Session expired. Please login again."); // optional
        window.location.href = "/";
        throw new Error("Session expired. Redirecting to login.");
      }
    }
  
    return response;
  }
  