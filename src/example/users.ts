export interface User {
  id: string;
  name: string;
  email: string;
  gender: 'Man' | 'Woman';
}

const users: Record<string, User> = {
  u_123: {
    id: 'u_123',
    name: 'Ada',
    email: 'ada@example.com',
    gender: 'Woman',
  },
  u_321: {
    id: 'u_321',
    name: 'John',
    email: 'john@example.com',
    gender: 'Man',
  },
};

export function getUser(id: string): User | undefined {
  return users[id];
}
