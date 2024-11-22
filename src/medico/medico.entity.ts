

import { PacienteEntity } from "../paciente/paciente.entity";
import { ManyToOne, Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";

@Entity()
export class MedicoEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    especialidad: string;

    @Column()
    telefono: string;

    @ManyToMany(() => PacienteEntity, paciente => paciente.medicos)
    @JoinTable()
    pacientes: PacienteEntity[];

}