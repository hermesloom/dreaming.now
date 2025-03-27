export async function fetchAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("sessionToken");
  if (!token) {
    throw new Error("No token found");
  }
  return fetch(url, {
    ...options,
    headers: { ...options.headers, Authorization: `Bearer ${token}` },
  });
}
