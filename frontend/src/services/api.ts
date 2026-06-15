const API_URL = "http://localhost:8000";

export async function apiFetch<T>(
  endpoint: string
): Promise<T> {

  const response = await fetch(
    `${API_URL}${endpoint}`
  );

  if (!response.ok) {
    throw new Error(
      `Erro HTTP ${response.status}`
    );
  }

  return response.json();
}