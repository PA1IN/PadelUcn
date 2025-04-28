import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  rut: string;

  @Column()
  password: string;

  @Column()
  nombre: string;
}
