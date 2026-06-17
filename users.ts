export interface User {
  id: string;
  name: string;
  emailAddress: string;
}

const users: Record<string, User> = {
  u_123: { id: 'u_123', name: 'Ada', emailAddress: 'ada@example.com' },
};

export function getUser(id: string): User | undefined {
  return users[id];
}
