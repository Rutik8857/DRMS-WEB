export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
  : "http://localhost:5000";

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // 1. Validate Configuration
  if (!API_BASE_URL) {
    throw new Error("Configuration Error: NEXT_PUBLIC_API_URL is not defined");
  }

  // 2. Get Token
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // 3. Prepare Headers
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // 4. Fetch
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 5. Handle Errors
  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.message) errorMessage = errorData.message;
      if (errorData.details) errorMessage += ` (${errorData.details})`;
    } catch (e) {
      // Ignore JSON parse errors if response isn't JSON
    }
    throw new Error(errorMessage);
  }

  return response.json();
}