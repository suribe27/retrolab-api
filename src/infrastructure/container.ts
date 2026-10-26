import { AuthService } from '../application/AuthService';
import { CamisetaService } from '../application/CamisetaService';
import { SolicitudService } from '../application/SolicitudService';
import { PrismaCamisetaRepository } from './repositories/PrismaCamisetaRepository';
import { PrismaSolicitudRepository } from './repositories/PrismaSolicitudRepository';
import { PrismaUserRepository } from './repositories/PrismaUserRepository';
import { BcryptPasswordHasher } from './security/BcryptPasswordHasher';
import { JwtTokenService } from './security/JwtTokenService';

// Composición: aquí se conectan las implementaciones con los casos de uso
export const tokenService = new JwtTokenService();

const userRepository = new PrismaUserRepository();
const camisetaRepository = new PrismaCamisetaRepository();
const solicitudRepository = new PrismaSolicitudRepository();
const passwordHasher = new BcryptPasswordHasher();

export const authService = new AuthService(userRepository, passwordHasher, tokenService);
export const camisetaService = new CamisetaService(camisetaRepository);
export const solicitudService = new SolicitudService(solicitudRepository, camisetaRepository);
