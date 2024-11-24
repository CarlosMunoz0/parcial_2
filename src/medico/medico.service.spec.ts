import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicoService } from './medico.service';
import { MedicoEntity } from './medico.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('MedicoService', () => {
  let service: MedicoService;
  let repository: Repository<MedicoEntity>;
  let medicosList: MedicoEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MedicoService],
    }).compile();

    service = module.get<MedicoService>(MedicoService);
    repository = module.get<Repository<MedicoEntity>>(getRepositoryToken(MedicoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    medicosList = [];
    for (let i = 0; i < 5; i++) {
      const medico: MedicoEntity = await repository.save({
        nombre: faker.person.firstName(),
        especialidad: faker.helpers.arrayElement(['Cardiología', 'Pediatría', 'Neurología', 'Dermatología']),
        telefono: faker.phone.number(),
        pacientes: []
      });
      medicosList.push(medico);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all medicos', async () => {
    const medicos: MedicoEntity[] = await service.findAll();
    expect(medicos).not.toBeNull();
    expect(medicos).toHaveLength(medicosList.length);
  });

  it('findOne should return a medico by id', async () => {
    const storedMedico: MedicoEntity = medicosList[0];
    const medico: MedicoEntity = await service.findOne(storedMedico.id);
    expect(medico).not.toBeNull();
    expect(medico.nombre).toEqual(storedMedico.nombre);
    expect(medico.especialidad).toEqual(storedMedico.especialidad);
    expect(medico.telefono).toEqual(storedMedico.telefono);
  });

  it('findOne should throw an exception for an invalid medico', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty(
      "message",
      "The doctor with the given id was not found"
    );
  });

  it('create should return a new medico', async () => {
    const medico: MedicoEntity = {
      id: "",
      nombre: faker.person.firstName(),
      especialidad: faker.helpers.arrayElement(['Cardiología', 'Pediatría', 'Neurología', 'Dermatología']),
      telefono: faker.phone.number(),
      pacientes: []
    };

    const newMedico: MedicoEntity = await service.create(medico);
    expect(newMedico).not.toBeNull();

    const storedMedico: MedicoEntity = await repository.findOne({ where: { id: newMedico.id } });
    expect(storedMedico).not.toBeNull();
    expect(storedMedico.nombre).toEqual(newMedico.nombre);
    expect(storedMedico.especialidad).toEqual(newMedico.especialidad);
    expect(storedMedico.telefono).toEqual(newMedico.telefono);
  });

  it('update should modify a medico', async () => {
    const medico: MedicoEntity = medicosList[0];
    medico.nombre = faker.person.firstName();
    medico.especialidad = faker.helpers.arrayElement(['Cardiología', 'Pediatría', 'Neurología', 'Dermatología']);
    medico.telefono = faker.phone.number();

    const updatedMedico: MedicoEntity = await service.update(medico.id, medico);
    expect(updatedMedico).not.toBeNull();
    
    const storedMedico: MedicoEntity = await repository.findOne({ where: { id: medico.id } });
    expect(storedMedico).not.toBeNull();
    expect(storedMedico.nombre).toEqual(medico.nombre);
    expect(storedMedico.especialidad).toEqual(medico.especialidad);
    expect(storedMedico.telefono).toEqual(medico.telefono);
  });

  it('update should throw an exception for an invalid medico', async () => {
    let medico: MedicoEntity = medicosList[0];
    medico = {
      ...medico,
      nombre: faker.person.firstName(),
      especialidad: faker.helpers.arrayElement(['Cardiología', 'Pediatría', 'Neurología', 'Dermatología']),
      telefono: faker.phone.number()
    };
    await expect(() => service.update("0", medico)).rejects.toHaveProperty(
      "message",
      "The doctor with the given id was not found"
    );
  });

  it('delete should remove a medico', async () => {
    const medico: MedicoEntity = medicosList[0];
    await service.delete(medico.id);
    const deletedMedico: MedicoEntity = await repository.findOne({ where: { id: medico.id } });
    expect(deletedMedico).toBeNull();
  });

  it('delete should throw an exception for an invalid medico', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty(
      "message",
      "The doctor with the given id was not found"
    );
  });
});