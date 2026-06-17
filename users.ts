export interface User {
  id: string;
  name: string;
  emailAddress: string;
  gender: 'Male' | 'Female';
}

const users: Record<string, User> = {
  u_123: {
    id: 'u_123',
    name: 'Ada',
    emailAddress: 'ada@example.com',
    gender: 'Female',
  },
  u_321: {
    id: 'u_321',
    name: 'John',
    emailAddress: 'john@example.com',
    gender: 'Male',
  },
};

export function getUser(id: string): User | undefined {
  return users[id];
}
