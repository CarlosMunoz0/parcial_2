import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PacienteService } from './paciente.service';
import { PacienteEntity } from './paciente.entity';

describe('PacienteService', () => {
  let service: PacienteService;
  let repository: Repository<PacienteEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacienteService,
        {
          provide: getRepositoryToken(PacienteEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    repository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a patient with a valid name', async () => {
      
      const paciente: PacienteEntity = {
        id: undefined,
        nombre: 'Juan Pérez',
        genero: 'Masculino',
        diagnosticos: [],
        medicos: []
      };

      jest.spyOn(repository, 'save').mockResolvedValue(paciente);

      const result = await service.create(paciente);

    
      expect(result).toBe(paciente);
      expect(repository.save).toHaveBeenCalledWith(paciente);
    });

    it('should throw a error when creating a patient with a name less than 3 characters', async () => {
      const paciente: PacienteEntity = {
        id: undefined,
        nombre: 'Jo',
        genero: 'Masculino',
        diagnosticos: [],
        medicos: []
      };

      await expect(service.create(paciente)).rejects.toHaveProperty('User name must be at least 3 characters long');
    });
  });
});