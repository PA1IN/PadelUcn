import { BoletaEquipamiento } from '../../boleta-equipamiento/entities/boleta-equipamiento.entity';
export declare class Equipamiento {
    id_equipamiento: number;
    tipo: string;
    costo: number;
    stock: number;
    boletas: BoletaEquipamiento[];
}
