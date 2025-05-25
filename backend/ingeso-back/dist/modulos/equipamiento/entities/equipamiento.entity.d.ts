import { BoletaEquipamiento } from '../../boleta-equipamiento/entities/boleta-equipamiento.entity';
export declare class Equipamiento {
    id: number;
    tipo: string;
    costo: number;
    stock: number;
    nombre: string;
    boletas: BoletaEquipamiento[];
}
