import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/bussiness-errors.interceptor'
import { MedicoDto } from './medico.dto';
import { MedicoEntity } from './medico.entity';
import { MedicoService } from './medico.service';

@Controller('medicos')
@UseInterceptors(BusinessErrorsInterceptor)
export class MedicoController {
    constructor(private readonly medicoService: MedicoService) {}

    @Get()
    async findAll(): Promise<MedicoEntity[]> {
        return await this.medicoService.findAll();
    }

    @Get(':medicoId')
    async findOne(@Param('medicoId') medicoId: string): Promise<MedicoEntity> {
        return await this.medicoService.findOne(medicoId);
    }

    @Post()
    async create(@Body() medicoDto: MedicoDto): Promise<MedicoEntity> {
        return await this.medicoService.create(plainToInstance(MedicoEntity, medicoDto));
    }

    @Put(':medicoId')
    async update(@Param('medicoId') medicoId: string, @Body() medicoDto: MedicoDto): Promise<MedicoEntity> {
        return await this.medicoService.update(medicoId, plainToInstance(MedicoEntity, medicoDto));
    }

    @Delete(':medicoId')
    @HttpCode(204)
    async delete(@Param('medicoId') medicoId: string): Promise<void> {
        await this.medicoService.delete(medicoId);
    }
}