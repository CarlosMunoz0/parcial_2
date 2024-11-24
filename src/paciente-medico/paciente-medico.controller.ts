import { Controller, Param, Post, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/bussiness-errors.interceptor';
import { PacienteEntity } from '../paciente/paciente.entity';
import { PacienteMedicoService } from './paciente-medico.service';

@Controller('pacientes/:pacienteId/medicos')
@UseInterceptors(BusinessErrorsInterceptor)
export class PacienteMedicoController {
    constructor(private readonly pacienteMedicoService: PacienteMedicoService) { }

    @Post(':medicoId')
    async addMedicoToPaciente(@Param('pacienteId') pacienteId: string, @Param('medicoId') medicoId: string): Promise<PacienteEntity> {
        return await this.pacienteMedicoService.addMedicoToPaciente(pacienteId, medicoId);
    }
}