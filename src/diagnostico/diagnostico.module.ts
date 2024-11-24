import { Module } from '@nestjs/common';
import { DiagnosticoService } from './diagnostico.service';
import { DiagnosticoEntity } from './diagnostico.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosticoController } from './diagnostico.controller';

@Module({
  providers: [DiagnosticoService],
  imports: [TypeOrmModule.forFeature([DiagnosticoEntity])],
  controllers: [DiagnosticoController],
})
export class DiagnosticoModule {}
