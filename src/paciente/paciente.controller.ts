import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/bussiness-errors.interceptor'
import { PacienteDto } from './paciente.dto';
import { PacienteEntity } from './paciente.entity';
import { PacienteService } from './paciente.service';

@Controller('pacientes')
@UseInterceptors(BusinessErrorsInterceptor)
export class PacienteController {
    constructor(private readonly pacienteService: PacienteService) {}

    @Get()
    async findAll(): Promise<PacienteEntity[]> {
        return await this.pacienteService.findAll();
    }

    @Get(':pacienteId')
    async findOne(@Param('pacienteId') pacienteId: string): Promise<PacienteEntity> {
        return await this.pacienteService.findOne(pacienteId);
    }

    @Post()
    async create(@Body() pacienteDto: PacienteDto): Promise<PacienteEntity> {
        return await this.pacienteService.create(plainToInstance(PacienteEntity, pacienteDto));
    }

    @Put(':pacienteId')
    async update(@Param('pacienteId') pacienteId: string, @Body() pacienteDto: PacienteDto): Promise<PacienteEntity> {
        return await this.pacienteService.update(pacienteId, plainToInstance(PacienteEntity, pacienteDto));
    }

    @Delete(':pacienteId')
    @HttpCode(204)
    async delete(@Param('pacienteId') pacienteId: string): Promise<void> {
        await this.pacienteService.delete(pacienteId);
    }
}