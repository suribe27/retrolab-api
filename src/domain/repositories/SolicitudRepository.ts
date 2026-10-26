import { CreateSolicitudData, SolicitudConDetalle } from '../entities/Solicitud';

export interface SolicitudRepository {
  create(data: CreateSolicitudData): Promise<SolicitudConDetalle>;
  findByUser(userId: number): Promise<SolicitudConDetalle[]>;
  findAll(): Promise<SolicitudConDetalle[]>;
}
