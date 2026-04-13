const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

type RequestOptions = RequestInit & { authToken?: string };

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (options.authToken) {
    headers.set("Authorization", `Bearer ${options.authToken}`);
  }

  // Properly construct fetch options
  const fetchOptions: RequestInit = {
    method: options.method || "GET",
    headers,
  };
  if (options.body) fetchOptions.body = options.body;
  if (options.signal) fetchOptions.signal = options.signal;

  const response = await fetch(`${API_BASE}${path}`, fetchOptions);
  const data = (await response.json()) as unknown;
  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data && typeof data.message === "string"
        ? data.message
        : `Request failed with status ${response.status}`;
    throw new Error(message);
  }
  return data as T;
}

