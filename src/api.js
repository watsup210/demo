// The browser calls Vite's /api proxy in development, and Python directly in production.
async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(path, {
      ...options,
      signal: options.signal ?? AbortSignal.timeout(10000),
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error("Cannot reach the Python server. Please try again.", {
      cause: error,
    });
  }
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const detail = data.detail;
    throw new Error(
      typeof detail === "string"
        ? detail
        : "The search could not be validated. Check your locations and time, then try again.",
    );
  }
  return response.json();
}
export function getLocations(signal) {
  return request("/api/locations", { signal });
}
export function previewSearch(search) {
  return request("/api/search-preview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(search),
  });
}
