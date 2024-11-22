import { Module } from '@nestjs/common';
import { PacienteMedicoService } from './paciente-medico.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicoEntity } from '../medico/medico.entity';
import { PacienteEntity } from '../paciente/paciente.entity';
//import { PacienteMedicoController } from './paciente-medico.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MedicoEntity, PacienteEntity])],
  providers: [PacienteMedicoService],
  controllers: []
})
export class PacienteMedicoModule {}