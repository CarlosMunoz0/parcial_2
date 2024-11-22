import { PacienteEntity } from "../paciente/paciente.entity";
import { ManyToOne, Column, Entity, PrimaryGeneratedColumn, ManyToMany } from "typeorm";

@Entity()
export class DiagnosticoEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @ManyToMany(() => PacienteEntity, (paciente) => paciente.diagnosticos )
    pacientes: PacienteEntity;
}