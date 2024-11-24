import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { PacienteMedicoService } from './paciente-medico.service';
import { PacienteEntity } from '../paciente/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('PacienteMedicoService', () => {
  let service: PacienteMedicoService;
  let pacienteRepository: Repository<PacienteEntity>;
  let medicoRepository: Repository<MedicoEntity>;
  let paciente: PacienteEntity;
  let medicosList: MedicoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteMedicoService],
    }).compile();

    service = module.get<PacienteMedicoService>(PacienteMedicoService);
    pacienteRepository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    medicoRepository = module.get<Repository<MedicoEntity>>(getRepositoryToken(MedicoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await pacienteRepository.clear();
    await medicoRepository.clear();
    
    medicosList = [];
    for (let i = 0; i < 5; i++) {
      const medico: MedicoEntity = await medicoRepository.save({
        nombre: faker.person.firstName(),
        especialidad: faker.lorem.word(),
        telefono: faker.phone.number()
      });
      medicosList.push(medico);
    }

    paciente = await pacienteRepository.save({
      nombre: faker.person.firstName(),
      genero: faker.helpers.arrayElement(['M', 'F']),
      medicos: medicosList.slice(0, 3) // Initialize with 3 doctors
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMedicoToPaciente should add a doctor to a patient', async () => {
    const newMedico: MedicoEntity = await medicoRepository.save({
      nombre: faker.person.firstName(),
      especialidad: faker.lorem.word(),
      telefono: faker.phone.number()
    });

    const updatedPaciente = await service.addMedicoToPaciente(paciente.id, newMedico.id);
    expect(updatedPaciente.medicos.length).toBe(4);
    expect(updatedPaciente.medicos.some(m => m.id === newMedico.id)).toBeTruthy();
  });

  it('addMedicoToPaciente should throw an exception for an invalid patient id', async () => {
    const newMedico: MedicoEntity = await medicoRepository.save({
      nombre: faker.person.firstName(),
      especialidad: faker.lorem.word(),
      telefono: faker.phone.number()
    });

    await expect(() => service.addMedicoToPaciente("0", newMedico.id))
      .rejects
      .toHaveProperty("message", "The user with the given id was not found");
  });

  it('addMedicoToPaciente should throw an exception for an invalid doctor id', async () => {
    await expect(() => service.addMedicoToPaciente(paciente.id, "0"))
      .rejects
      .toHaveProperty("message", "The doctor with the given id was not found");
  });

  it('addMedicoToPaciente should throw an exception when patient already has 5 doctors', async () => {
    
    const extraMedicos = [];
    for (let i = 0; i < 2; i++) {
      const medico = await medicoRepository.save({
        nombre: faker.person.firstName(),
        especialidad: faker.lorem.word(),
        telefono: faker.phone.number()
      });
      extraMedicos.push(medico);
    }

    // fourth doctor
    await service.addMedicoToPaciente(paciente.id, extraMedicos[0].id);
    // fifth doctor
    await service.addMedicoToPaciente(paciente.id, extraMedicos[1].id);

    // Try to add a sixth doctor
    const oneMoreMedico = await medicoRepository.save({
      nombre: faker.person.firstName(),
      especialidad: faker.lorem.word(),
      telefono: faker.phone.number()
    });

    await expect(() => service.addMedicoToPaciente(paciente.id, oneMoreMedico.id))
      .rejects
      .toHaveProperty("message", "The patient user have more than 5 doctors");
  });
});