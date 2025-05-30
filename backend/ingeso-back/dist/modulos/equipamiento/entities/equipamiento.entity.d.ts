import { BoletaEquipamiento } from '../../boleta-equipamiento/entities/boleta-equipamiento.entity';
export declare class Equipamiento {
    id: number;
    tipo: string;
    nombre: string;
    stock: number;
    costo: number;
    boletas: BoletaEquipamiento[];
}
