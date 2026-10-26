import { AuthService } from '../application/AuthService';
import { PrismaUserRepository } from './repositories/PrismaUserRepository';
import { BcryptPasswordHasher } from './security/BcryptPasswordHasher';
import { JwtTokenService } from './security/JwtTokenService';

// Composición: aquí se conectan las implementaciones con los casos de uso
export const tokenService = new JwtTokenService();

const userRepository = new PrismaUserRepository();
const passwordHasher = new BcryptPasswordHasher();

export const authService = new AuthService(userRepository, passwordHasher, tokenService);
