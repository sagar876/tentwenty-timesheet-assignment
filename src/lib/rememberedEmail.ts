const STORAGE_KEY = "ticktock:rememberedEmail";

export function getRememberedEmail(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function setRememberedEmail(email: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, email);
  } catch {
    // Storage may be unavailable (private browsing, quota, disabled) -
    // remembering the email is a convenience, not a requirement.
  }
}

export function clearRememberedEmail(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // See setRememberedEmail.
  }
}
