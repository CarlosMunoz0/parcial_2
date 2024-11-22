import { DiagnosticoEntity } from "../diagnostico/diagnostico.entity";
import { MedicoEntity } from "../medico/medico.entity";
import {  Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";

@Entity()
export class PacienteEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    genero: string;

    @ManyToMany(() => DiagnosticoEntity, diagnostico => diagnostico.pacientes)
    @JoinTable()
    diagnosticos: DiagnosticoEntity[];

    @ManyToMany(() => MedicoEntity, medico => medico.pacientes)
    medicos: MedicoEntity[];


}