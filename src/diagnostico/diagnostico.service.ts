import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiagnosticoEntity } from './diagnostico.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/bussiness-errors';


@Injectable()
export class DiagnosticoService {
    constructor(
        @InjectRepository(DiagnosticoEntity)
        private readonly diagnosticoRepository: Repository<DiagnosticoEntity>,
    ) { }

    async findAll(): Promise<DiagnosticoEntity[]> {
        return await this.diagnosticoRepository.find({ relations: ['pacientes'] });
    }

    async findOne(id: string): Promise<DiagnosticoEntity> {
        const diagnostico: DiagnosticoEntity = await this.diagnosticoRepository.findOne({ where: { id }, relations: ['pacientes'] });
        if (!diagnostico)
            throw new BusinessLogicException("The diagnostic with the given id was not found", BusinessError.NOT_FOUND);
        return diagnostico;
    }

    async create(diagnostico: DiagnosticoEntity): Promise<DiagnosticoEntity> {
        
        if (diagnostico.descripcion && diagnostico.descripcion.trim().length > 200) {
            throw new BusinessLogicException("Diagnostic description must be 200 characters or less", BusinessError.BAD_REQUEST);
        }
        return await this.diagnosticoRepository.save(diagnostico);
    }

    async update(id: string, diagnostico: DiagnosticoEntity): Promise<DiagnosticoEntity> {
        
        if (diagnostico.descripcion && diagnostico.descripcion.trim().length > 200) {
            throw new BusinessLogicException("Diagnostic description must be 200 characters or less", BusinessError.BAD_REQUEST);
        }
        
        const diagnosticoToUpdate: DiagnosticoEntity = await this.diagnosticoRepository.findOne({ where: { id } });
        if (!diagnosticoToUpdate)
            throw new BusinessLogicException("The diagnostic with the given id was not found", BusinessError.NOT_FOUND);
        return await this.diagnosticoRepository.save({ ...diagnosticoToUpdate, ...diagnostico });
    }

    async delete(id: string): Promise<void> {
        const diagnosticoToDelete: DiagnosticoEntity = await this.diagnosticoRepository.findOne({ where: { id } });
        if (!diagnosticoToDelete)
            throw new BusinessLogicException("The diagnostic with the given id was not found", BusinessError.NOT_FOUND);
        await this.diagnosticoRepository.remove(diagnosticoToDelete);
    }
}