import { TypeOrmModule } from "@nestjs/typeorm";
import { DiagnosticoEntity } from "src/diagnostico/diagnostico.entity";
import { MedicoEntity } from "src/medico/medico.entity";
import { PacienteEntity } from "src/paciente/paciente.entity";

export const TypeOrmTestingConfig = () => [
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [MedicoEntity, DiagnosticoEntity, PacienteEntity],
        synchronize: true,
        keepConnectionAlive: true
    }),
    TypeOrmModule.forFeature([MedicoEntity, DiagnosticoEntity, PacienteEntity]),
];