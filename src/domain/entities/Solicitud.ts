export interface Solicitud {
  id: number;
  userId: number;
  camisetaId: number;
  talla: string;
  mensaje: string | null;
  estado: string;
  createdAt: Date;
}

export interface SolicitudConDetalle extends Solicitud {
  camiseta: { id: number; name: string; image: string; price: number };
  user?: { id: number; nombre: string; email: string };
}

export interface CreateSolicitudData {
  userId: number;
  camisetaId: number;
  talla: string;
  mensaje?: string;
}
