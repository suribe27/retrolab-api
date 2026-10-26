import { SolicitudConDetalle } from '../domain/entities/Solicitud';
import { BadRequestError, NotFoundError } from '../domain/errors/AppError';
import { CamisetaRepository } from '../domain/repositories/CamisetaRepository';
import { SolicitudRepository } from '../domain/repositories/SolicitudRepository';

export interface CrearSolicitudInput {
  camisetaId: number;
  talla: string;
  mensaje?: string;
}

export class SolicitudService {
  constructor(
    private readonly solicitudes: SolicitudRepository,
    private readonly camisetas: CamisetaRepository,
  ) {}

  /** userId viene del token (req.user), nunca del body */
  async crear(userId: number, input: CrearSolicitudInput): Promise<SolicitudConDetalle> {
    const camiseta = await this.camisetas.findById(input.camisetaId);
    if (!camiseta) throw new NotFoundError('La camiseta seleccionada no existe');
    if (!camiseta.isAvailable) {
      throw new BadRequestError('Esta camiseta no está disponible', [
        { field: 'camisetaId', message: 'Esta camiseta está agotada' },
      ]);
    }

    return this.solicitudes.create({ userId, ...input });
  }

  mias(userId: number): Promise<SolicitudConDetalle[]> {
    return this.solicitudes.findByUser(userId);
  }

  todas(): Promise<SolicitudConDetalle[]> {
    return this.solicitudes.findAll();
  }
}
