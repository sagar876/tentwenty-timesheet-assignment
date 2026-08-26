export interface MockUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
  },
  {
    id: "2",
    name: "Sagar Dixit",
    email: "sagar@example.com",
    password: "password1234",
  },
];

export function findUserByCredentials(
  email: string,
  password: string,
): MockUser | undefined {
  return MOCK_USERS.find(
    (user) => user.email === email && user.password === password,
  );
}
