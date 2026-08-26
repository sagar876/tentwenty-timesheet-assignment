export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function extractErrorMessage(data: unknown, status: number): string {
  if (data && typeof data === "object" && "error" in data && typeof data.error === "string") {
    return data.error;
  }
  return `Request failed with status ${status}`;
}

export async function parseJsonOrThrow<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(response.status, extractErrorMessage(data, response.status));
  }
  return data as T;
}

export async function throwIfNotOk(response: Response): Promise<void> {
  if (response.ok) return;
  const data = await response.json().catch(() => null);
  throw new ApiError(response.status, extractErrorMessage(data, response.status));
}
