import { Module } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteEntity } from './paciente.entity';
import { PacienteController } from './paciente.controller';

@Module({
  providers: [PacienteService],
  imports: [TypeOrmModule.forFeature([PacienteEntity])],
  controllers: [PacienteController],
})
export class PacienteModule {}
