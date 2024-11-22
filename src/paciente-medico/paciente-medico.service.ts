import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/bussiness-errors'
import { Repository } from 'typeorm';
import { MedicoEntity } from '../medico/medico.entity';
import { PacienteEntity } from '../paciente/paciente.entity';

@Injectable()
export class PacienteMedicoService {
    constructor(
        @InjectRepository(PacienteEntity)
        private readonly pacienteRepository: Repository<PacienteEntity>,
        @InjectRepository(MedicoEntity)
        private readonly medicoRepository: Repository<MedicoEntity>,
    ) { }

    async addMedicoToPaciente(pacienteId: string, medicoId: string): Promise<PacienteEntity> {
        const paciente: PacienteEntity = await this.pacienteRepository.findOne({ where: { id: pacienteId }, relations: ['medicos'] });

        if (!paciente)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);


        const medico: MedicoEntity = await this.medicoRepository.findOne({ where: { id: medicoId } });
        if (!medico)
            throw new BusinessLogicException("The doctor with the given id was not found", BusinessError.NOT_FOUND);

        if (paciente.medicos.length >= 5)
            throw new BusinessLogicException( "The patient user have more than 5 doctors", BusinessError.BAD_REQUEST);

        paciente.medicos = [...paciente.medicos, medico];
        return await this.pacienteRepository.save(paciente);
    }

}