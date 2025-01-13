class ApiError extends Error {
  constructor(public status: number, public data: Record<string, unknown>) {
    super();
  }
}

export const fetchApi = async <T>(
  url: string,
  {
    payload,
    method,
  }: { payload?: Record<string, unknown>; method?: string } = {}
): Promise<T> => {
  method ??= payload ? "POST" : "GET";
  const request = await fetch(`http://localhost:3000/api${url}`, {
    method,
    credentials: "include",
    body: payload ? JSON.stringify(payload) : undefined,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!request.ok) {
    const errorData = await request.json();
    throw new ApiError(request.status, errorData);
  }
  return (await request.json()) as Promise<T>;
};
