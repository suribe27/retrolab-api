export type Role = 'admin' | 'user';

export interface User {
  id: number;
  nombre: string;
  email: string;
  password: string; // hash de bcrypt, nunca texto plano
  role: Role;
  createdAt: Date;
}

/** Usuario sin la contraseña: lo único que puede salir en una respuesta. */
export type PublicUser = Omit<User, 'password'>;

export interface CreateUserData {
  nombre: string;
  email: string;
  password: string;
  role?: Role;
}

/** Lo que va dentro del JWT: solo lo necesario. */
export interface AuthPayload {
  id: number;
  role: Role;
}

export function toPublicUser(user: User): PublicUser {
  const { password: _password, ...publicUser } = user;
  return publicUser;
}
