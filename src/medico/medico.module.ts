import { Module } from '@nestjs/common';
import { MedicoService } from './medico.service';
import { MedicoEntity } from './medico.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicoController } from './medico.controller';

@Module({
  providers: [MedicoService],
  imports: [TypeOrmModule.forFeature([MedicoEntity])],
  controllers: [MedicoController],
  

})
export class MedicoModule {}
