import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicoEntity } from './medico.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/bussiness-errors';


@Injectable()
export class MedicoService {
    constructor(
        @InjectRepository(MedicoEntity)
        private readonly medicoRepository: Repository<MedicoEntity>,
    ) { }

    async findAll(): Promise<MedicoEntity[]> {
        return await this.medicoRepository.find({ relations: ['pacientes'] });
    }

    async findOne(id: string): Promise<MedicoEntity> {
        const medico: MedicoEntity = await this.medicoRepository.findOne({ where: { id }, relations: ['pacientes'] });
        if (!medico)
            throw new BusinessLogicException("The doctor with the given id was not found", BusinessError.NOT_FOUND);
        return medico;
    }

    async create(medico: MedicoEntity): Promise<MedicoEntity> {
        return await this.medicoRepository.save(medico);
    }

    async update(id: string, medico: MedicoEntity): Promise<MedicoEntity> {
        const medicoToUpdate: MedicoEntity = await this.medicoRepository.findOne({ where: { id } });
        if (!medicoToUpdate)
            throw new BusinessLogicException("The doctor with the given id was not found", BusinessError.NOT_FOUND);
        return await this.medicoRepository.save({ ...medicoToUpdate, ...medico });
    }

    async delete(id: string): Promise<void> {
        const medicoToDelete: MedicoEntity = await this.medicoRepository.findOne({ where: { id } });
        if (!medicoToDelete)
            throw new BusinessLogicException("The doctor with the given id was not found", BusinessError.NOT_FOUND);
        await this.medicoRepository.remove(medicoToDelete);
    }
}
