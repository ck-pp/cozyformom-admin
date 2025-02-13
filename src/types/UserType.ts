// UserType.ts

export enum UserType {
    GUEST = 'guest',
    USER = 'user',
    ADMIN = 'admin',
}

/* 'string → enum' 변환 */
export function findByString(role: string): UserType {
  switch (role.toUpperCase()) {
    case 'GUEST':
      return UserType.GUEST;
    case 'USER':
      return UserType.USER;
    case 'ADMIN':
      return UserType.ADMIN;
    default:
      throw new Error(`No matching UserType for role: ${role}`);
  }
}