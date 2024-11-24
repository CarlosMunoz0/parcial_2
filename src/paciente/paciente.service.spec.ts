import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PacienteService } from './paciente.service';
import { PacienteEntity } from './paciente.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { BusinessLogicException } from '../shared/errors/bussiness-errors';

describe('PacienteService', () => {
  let service: PacienteService;
  let repository: Repository<PacienteEntity>;
  let pacientesList: PacienteEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteService],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    repository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    pacientesList = [];
    for (let i = 0; i < 5; i++) {
      const paciente: PacienteEntity = await repository.save({
        nombre: faker.person.firstName(),
        genero: faker.helpers.arrayElement(['M', 'F']),
        diagnosticos: [],
        medicos: []
      });
      pacientesList.push(paciente);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all pacientes', async () => {
    const pacientes: PacienteEntity[] = await service.findAll();
    expect(pacientes).not.toBeNull();
    expect(pacientes).toHaveLength(pacientesList.length);
  });

  it('findOne should return a paciente by id', async () => {
    const storedPaciente: PacienteEntity = pacientesList[0];
    const paciente: PacienteEntity = await service.findOne(storedPaciente.id);
    expect(paciente).not.toBeNull();
    expect(paciente.nombre).toEqual(storedPaciente.nombre);
    expect(paciente.genero).toEqual(storedPaciente.genero);
  });

  it('findOne should throw an exception for an invalid paciente', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty(
      "message",
      "The user with the given id was not found"
    );
  });

  it('create should return a new paciente', async () => {
    const paciente: PacienteEntity = {
      id: "",
      nombre: faker.person.firstName(),
      genero: faker.helpers.arrayElement(['M', 'F']),
      diagnosticos: [],
      medicos: []
    };

    const newPaciente: PacienteEntity = await service.create(paciente);
    expect(newPaciente).not.toBeNull();

    const storedPaciente: PacienteEntity = await repository.findOne({ where: { id: newPaciente.id } });
    expect(storedPaciente).not.toBeNull();
    expect(storedPaciente.nombre).toEqual(newPaciente.nombre);
    expect(storedPaciente.genero).toEqual(newPaciente.genero);
  });

  it('create should throw an exception for a nombre less than 3 characters', async () => {
    const paciente: PacienteEntity = {
      id: "",
      nombre: "ab",
      genero: faker.helpers.arrayElement(['M', 'F']),
      diagnosticos: [],
      medicos: []
    };

    await expect(() => service.create(paciente)).rejects.toHaveProperty(
      "message",
      "User name must be at least 3 characters long"
    );
  });

  it('update should modify a paciente', async () => {
    const paciente: PacienteEntity = pacientesList[0];
    paciente.nombre = faker.person.firstName();
    paciente.genero = faker.helpers.arrayElement(['M', 'F']);

    const updatedPaciente: PacienteEntity = await service.update(paciente.id, paciente);
    expect(updatedPaciente).not.toBeNull();
    
    const storedPaciente: PacienteEntity = await repository.findOne({ where: { id: paciente.id } });
    expect(storedPaciente).not.toBeNull();
    expect(storedPaciente.nombre).toEqual(paciente.nombre);
    expect(storedPaciente.genero).toEqual(paciente.genero);
  });

  it('update should throw an exception for an invalid paciente', async () => {
    let paciente: PacienteEntity = pacientesList[0];
    paciente = {
      ...paciente,
      nombre: faker.person.firstName(),
      genero: faker.helpers.arrayElement(['M', 'F'])
    };
    await expect(() => service.update("0", paciente)).rejects.toHaveProperty(
      "message",
      "The user with the given id was not found"
    );
  });

  it('update should throw an exception for a nombre less than 3 characters', async () => {
    const paciente: PacienteEntity = pacientesList[0];
    paciente.nombre = "ab";

    await expect(() => service.update(paciente.id, paciente)).rejects.toHaveProperty(
      "message",
      "User name must be at least 3 characters long"
    );
  });

  it('delete should remove a paciente', async () => {
    const paciente: PacienteEntity = pacientesList[0];
    await service.delete(paciente.id);
    const deletedPaciente: PacienteEntity = await repository.findOne({ where: { id: paciente.id } });
    expect(deletedPaciente).toBeNull();
  });

  it('delete should throw an exception for an invalid paciente', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty(
      "message",
      "The user with the given id was not found"
    );
  });
});