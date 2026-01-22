export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("hubspotToken");
  if (!token) throw new Error("Missing token");

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-hubspot-token": token,
      ...(options.headers || {}),
    },
  });

  // If success → return response as usual
  if (response.ok) return response;

  // If error → attempt to parse HubSpot JSON
  let errorJson = null;
  try {
    errorJson = await response.json();
  } catch (err) {
    // JSON parse failed, fallback
    throw new Error("Failed to fetch: " + response.statusText);
  }

  // Throw error object with JSON included
  const error = new Error(errorJson.message || "HubSpot API error");
  error.data = errorJson;
  throw error;
}
