export async function apiRequest(method: string, url: string, data?: any) {
  const isFormData = data instanceof FormData;

  const headers: HeadersInit = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const body = isFormData ? data : data ? JSON.stringify(data) : undefined;

  const response = await fetch(url, {
    method,
    headers,
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status} ${errorText}`);
  }

  return response;
}
