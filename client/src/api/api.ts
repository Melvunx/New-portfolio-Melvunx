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
  const r = await fetch(`http://localhost:3000/api${url}`, {
    method,
    credentials: "include",
    body: payload ? JSON.stringify(payload) : undefined,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  const json = await r.json();

  if (!r.ok) {
    throw new ApiError(r.status, json);
  }

  console.log("The json after fetching : ", json);

  if (json.success && json.data) {
    console.log(json.message);
    return json.data as T;
  }

  return json;
};
