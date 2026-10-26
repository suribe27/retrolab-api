import { ConflictError, NotFoundError, UnauthorizedError } from '../domain/errors/AppError';
import { PublicUser, toPublicUser } from '../domain/entities/User';
import { UserRepository } from '../domain/repositories/UserRepository';
import { PasswordHasher, TokenService } from '../domain/services/security';

export interface RegisterInput {
  nombre: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  token: string;
  user: PublicUser;
}

// Mismo mensaje para email o contraseña incorrectos: no revela cuál falló
const CREDENCIALES_INVALIDAS = 'Credenciales inválidas';

export class AuthService {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly tokens: TokenService,
  ) {}

  async register(input: RegisterInput): Promise<PublicUser> {
    const email = input.email.toLowerCase();
    const existente = await this.users.findByEmail(email);
    if (existente) {
      throw new ConflictError('El email ya está registrado', [
        { field: 'email', message: 'Este correo ya está registrado' },
      ]);
    }

    const hash = await this.hasher.hash(input.password);
    const user = await this.users.create({ nombre: input.nombre, email, password: hash, role: 'user' });
    return toPublicUser(user);
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await this.users.findByEmail(input.email.toLowerCase());
    if (!user) throw new UnauthorizedError(CREDENCIALES_INVALIDAS);

    const coincide = await this.hasher.compare(input.password, user.password);
    if (!coincide) throw new UnauthorizedError(CREDENCIALES_INVALIDAS);

    const token = this.tokens.sign({ id: user.id, role: user.role });
    return { token, user: toPublicUser(user) };
  }

  async me(userId: number): Promise<PublicUser> {
    const user = await this.users.findById(userId);
    if (!user) throw new NotFoundError('Usuario no encontrado');
    return toPublicUser(user);
  }
}
