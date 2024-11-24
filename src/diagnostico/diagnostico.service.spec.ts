import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiagnosticoService } from './diagnostico.service';
import { DiagnosticoEntity } from './diagnostico.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('DiagnosticoService', () => {
  let service: DiagnosticoService;
  let repository: Repository<DiagnosticoEntity>;
  let diagnosticosList: DiagnosticoEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [DiagnosticoService],
    }).compile();

    service = module.get<DiagnosticoService>(DiagnosticoService);
    repository = module.get<Repository<DiagnosticoEntity>>(getRepositoryToken(DiagnosticoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    diagnosticosList = [];
    for (let i = 0; i < 5; i++) {
      const diagnostico: DiagnosticoEntity = await repository.save({
        nombre: faker.science.chemicalElement().name,
        descripcion: faker.lorem.sentence().substring(0, 200), // Ensure description is within 200 chars
        pacientes: null
      });
      diagnosticosList.push(diagnostico);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all diagnosticos', async () => {
    const diagnosticos: DiagnosticoEntity[] = await service.findAll();
    expect(diagnosticos).not.toBeNull();
    expect(diagnosticos).toHaveLength(diagnosticosList.length);
  });

  it('findOne should return a diagnostico by id', async () => {
    const storedDiagnostico: DiagnosticoEntity = diagnosticosList[0];
    const diagnostico: DiagnosticoEntity = await service.findOne(storedDiagnostico.id);
    expect(diagnostico).not.toBeNull();
    expect(diagnostico.nombre).toEqual(storedDiagnostico.nombre);
    expect(diagnostico.descripcion).toEqual(storedDiagnostico.descripcion);
  });

  it('findOne should throw an exception for an invalid diagnostico', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty(
      "message",
      "The diagnostic with the given id was not found"
    );
  });

  it('create should return a new diagnostico', async () => {
    const diagnostico: DiagnosticoEntity = {
      id: "",
      nombre: faker.science.chemicalElement().name,
      descripcion: faker.lorem.sentence().substring(0, 200),
      pacientes: null
    };

    const newDiagnostico: DiagnosticoEntity = await service.create(diagnostico);
    expect(newDiagnostico).not.toBeNull();

    const storedDiagnostico: DiagnosticoEntity = await repository.findOne({ where: { id: newDiagnostico.id } });
    expect(storedDiagnostico).not.toBeNull();
    expect(storedDiagnostico.nombre).toEqual(newDiagnostico.nombre);
    expect(storedDiagnostico.descripcion).toEqual(newDiagnostico.descripcion);
  });

  it('create should throw an exception for description longer than 200 characters', async () => {
    const diagnostico: DiagnosticoEntity = {
      id: "",
      nombre: faker.science.chemicalElement().name,
      descripcion: faker.lorem.paragraphs(3), // Generate a very long description
      pacientes: null
    };

    await expect(() => service.create(diagnostico)).rejects.toHaveProperty(
      "message",
      "Diagnostic description must be 200 characters or less"
    );
  });

  it('update should modify a diagnostico', async () => {
    const diagnostico: DiagnosticoEntity = diagnosticosList[0];
    diagnostico.nombre = faker.science.chemicalElement().name;
    diagnostico.descripcion = faker.lorem.sentence().substring(0, 200);

    const updatedDiagnostico: DiagnosticoEntity = await service.update(diagnostico.id, diagnostico);
    expect(updatedDiagnostico).not.toBeNull();
    
    const storedDiagnostico: DiagnosticoEntity = await repository.findOne({ where: { id: diagnostico.id } });
    expect(storedDiagnostico).not.toBeNull();
    expect(storedDiagnostico.nombre).toEqual(diagnostico.nombre);
    expect(storedDiagnostico.descripcion).toEqual(diagnostico.descripcion);
  });

  it('update should throw an exception for an invalid diagnostico', async () => {
    let diagnostico: DiagnosticoEntity = diagnosticosList[0];
    diagnostico = {
      ...diagnostico,
      nombre: faker.science.chemicalElement().name,
      descripcion: faker.lorem.sentence().substring(0, 200)
    };
    await expect(() => service.update("0", diagnostico)).rejects.toHaveProperty(
      "message",
      "The diagnostic with the given id was not found"
    );
  });

  it('update should throw an exception for description longer than 200 characters', async () => {
    const diagnostico: DiagnosticoEntity = diagnosticosList[0];
    diagnostico.descripcion = faker.lorem.paragraphs(3); // Generate a very long description

    await expect(() => service.update(diagnostico.id, diagnostico)).rejects.toHaveProperty(
      "message",
      "Diagnostic description must be 200 characters or less"
    );
  });

  it('delete should remove a diagnostico', async () => {
    const diagnostico: DiagnosticoEntity = diagnosticosList[0];
    await service.delete(diagnostico.id);
    const deletedDiagnostico: DiagnosticoEntity = await repository.findOne({ where: { id: diagnostico.id } });
    expect(deletedDiagnostico).toBeNull();
  });

  it('delete should throw an exception for an invalid diagnostico', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty(
      "message",
      "The diagnostic with the given id was not found"
    );
  });
});