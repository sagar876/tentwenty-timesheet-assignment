import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import LoginPage from "./page";
import { persistSession } from "@/server/auth/sessionPersistence";

const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

const signInMock = jest.fn();
jest.mock("next-auth/react", () => ({
  signIn: (...args: unknown[]) => signInMock(...args),
}));

jest.mock("@/server/auth/sessionPersistence", () => ({
  persistSession: jest.fn(),
}));

const mockedPersistSession = persistSession as jest.MockedFunction<typeof persistSession>;

describe("LoginPage", () => {
  beforeEach(() => {
    pushMock.mockClear();
    signInMock.mockClear();
    mockedPersistSession.mockClear();
    window.localStorage.clear();
  });

  it("calls signIn with the submitted credentials and redirects on success", async () => {
    signInMock.mockResolvedValue({ error: undefined });
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() =>
      expect(signInMock).toHaveBeenCalledWith("credentials", {
        email: "john@example.com",
        password: "password123",
        redirect: false,
      }),
    );
    await waitFor(() => expect(mockedPersistSession).toHaveBeenCalledWith(false));
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/dashboard"));
  });

  it("passes rememberMe=true through to persistSession when the checkbox is checked", async () => {
    signInMock.mockResolvedValue({ error: undefined });
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByLabelText(/remember me/i));
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => expect(mockedPersistSession).toHaveBeenCalledWith(true));
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/dashboard"));
  });

  it("shows an error message and does not redirect on failed sign in", async () => {
    signInMock.mockResolvedValue({ error: "CredentialsSignin" });
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrong" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /invalid email or password/i,
    );
    expect(mockedPersistSession).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });

  describe("remembering the email across a return to the login page", () => {
    async function login(email: string, password: string, rememberMe: boolean) {
      cleanup();
      signInMock.mockResolvedValueOnce({ error: undefined });
      render(<LoginPage />);

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: email } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: password } });

      // The checkbox may already be checked by the mount-effect restoring a
      // previously remembered email, so set it explicitly rather than
      // assuming it starts unchecked.
      const rememberMeCheckbox = screen.getByLabelText(/remember me/i);
      const isChecked = rememberMeCheckbox.getAttribute("aria-checked") === "true";
      if (isChecked !== rememberMe) {
        fireEvent.click(rememberMeCheckbox);
      }

      fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/dashboard"));
    }

    /** Simulates returning to a fresh login page (e.g. after logout). */
    function returnToLogin() {
      cleanup();
      render(<LoginPage />);
    }

    it("prefills the email and checks Remember Me on return, with the password left empty", async () => {
      await login("sagar@example.com", "password1234", true);
      returnToLogin();

      expect(await screen.findByLabelText(/email/i)).toHaveValue("sagar@example.com");
      expect(screen.getByLabelText(/password/i)).toHaveValue("");
      expect(screen.getByLabelText(/remember me/i)).toBeChecked();
    });

    it("leaves the email and Remember Me unset on return when Remember Me was not checked", async () => {
      await login("sagar@example.com", "password1234", false);
      returnToLogin();

      expect(screen.getByLabelText(/email/i)).toHaveValue("");
      expect(screen.getByLabelText(/password/i)).toHaveValue("");
      expect(screen.getByLabelText(/remember me/i)).not.toBeChecked();
    });

    it("clears a previously remembered email when logging in again without Remember Me", async () => {
      await login("sagar@example.com", "password1234", true);
      returnToLogin();
      expect(await screen.findByLabelText(/email/i)).toHaveValue("sagar@example.com");

      await login("john@example.com", "password123", false);
      returnToLogin();

      expect(screen.getByLabelText(/email/i)).toHaveValue("");
      expect(screen.getByLabelText(/remember me/i)).not.toBeChecked();
    });

    it("never writes the password to localStorage", async () => {
      const setItemSpy = jest.spyOn(window.localStorage.__proto__, "setItem");

      await login("sagar@example.com", "super-secret-password", true);

      for (const call of setItemSpy.mock.calls) {
        expect(call.join(" ")).not.toContain("super-secret-password");
      }
      expect(window.localStorage.getItem("ticktock:rememberedEmail")).toBe("sagar@example.com");

      setItemSpy.mockRestore();
    });
  });
});
