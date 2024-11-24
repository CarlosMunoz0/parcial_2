import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/bussiness-errors.interceptor'
import { DiagnosticoDto } from './diagnostico.dto';
import { DiagnosticoEntity } from './diagnostico.entity';
import { DiagnosticoService } from './diagnostico.service';

@Controller('diagnosticos')
@UseInterceptors(BusinessErrorsInterceptor)
export class DiagnosticoController {
    constructor(private readonly diagnosticoService: DiagnosticoService) {}

    @Get()
    async findAll(): Promise<DiagnosticoEntity[]> {
        return await this.diagnosticoService.findAll();
    }

    @Get(':diagnosticoId')
    async findOne(@Param('diagnosticoId') diagnosticoId: string): Promise<DiagnosticoEntity> {
        return await this.diagnosticoService.findOne(diagnosticoId);
    }

    @Post()
    async create(@Body() diagnosticoDto: DiagnosticoDto): Promise<DiagnosticoEntity> {
        return await this.diagnosticoService.create(plainToInstance(DiagnosticoEntity, diagnosticoDto));
    }

    @Put(':diagnosticoId')
    async update(@Param('diagnosticoId') diagnosticoId: string, @Body() diagnosticoDto: DiagnosticoDto): Promise<DiagnosticoEntity> {
        return await this.diagnosticoService.update(diagnosticoId, plainToInstance(DiagnosticoEntity, diagnosticoDto));
    }

    @Delete(':diagnosticoId')
    @HttpCode(204)
    async delete(@Param('diagnosticoId') diagnosticoId: string): Promise<void> {
        await this.diagnosticoService.delete(diagnosticoId);
    }
}