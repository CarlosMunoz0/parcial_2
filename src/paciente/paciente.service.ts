import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PacienteEntity } from './paciente.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/bussiness-errors';


@Injectable()
export class PacienteService {
    constructor(
        @InjectRepository(PacienteEntity)
        private readonly pacienteRepository: Repository<PacienteEntity>,
    ) { }

    async findAll(): Promise<PacienteEntity[]> {
        return await this.pacienteRepository.find({ relations: ['medicos','diagnosticos'] });
    }

    async findOne(id: string): Promise<PacienteEntity> {
        const paciente: PacienteEntity = await this.pacienteRepository.findOne({ where: { id }, relations: ['medicos','diagnosticos'] });
        if (!paciente)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
        return paciente;
    }

    async create(paciente: PacienteEntity): Promise<PacienteEntity> {

        if (paciente.nombre && paciente.nombre.trim().length < 3) {
            throw new BusinessLogicException("User name must be at least 3 characters long", BusinessError.BAD_REQUEST);
        }
        return await this.pacienteRepository.save(paciente);
    }

    async update(id: string, paciente: PacienteEntity): Promise<PacienteEntity> {
        if (paciente.nombre && paciente.nombre.trim().length < 3) {
            throw new BusinessLogicException("User name must be at least 3 characters long", BusinessError.BAD_REQUEST);
        }
        const pacienteToUpdate: PacienteEntity = await this.pacienteRepository.findOne({ where: { id } });
        if (!pacienteToUpdate)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
        return await this.pacienteRepository.save({ ...pacienteToUpdate, ...paciente });
    }

    async delete(id: string): Promise<void> {
        const pacienteToDelete: PacienteEntity = await this.pacienteRepository.findOne({ where: { id } });
        if (!pacienteToDelete)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
        
        if (pacienteToDelete.diagnosticos && pacienteToDelete.diagnosticos.length > 0) {
            throw new BusinessLogicException("Cannot delete a patient with associated diagnoses", BusinessError.BAD_REQUEST);
        }
       
        await this.pacienteRepository.remove(pacienteToDelete);
    }
}
