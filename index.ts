import { getUser } from './users';

function greet(userId: string) {
  const user = getUser(userId);
  return 'Hello, ' + user?.name;
}

console.log(greet('u_123'));
