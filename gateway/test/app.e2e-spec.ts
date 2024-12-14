import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('CategoriasController (e2e)', () => {
  let app: INestApplication;
  let createdCategoryId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/categorias (POST) - Crear categoría', async () => {
    const payload = { nombre: 'Categoría de prueba', descripcion: 'Descripción de prueba' };

    const response = await request(app.getHttpServer())
      .post('/api/categorias')
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(payload);
    expect(response.body).toHaveProperty('id');

    createdCategoryId = response.body.id; // Guarda el ID de la categoría creada
  });

  it('/api/categorias (GET) - Obtener todas las categorías', async () => {
    const response = await request(app.getHttpServer()).get('/api/categorias');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: createdCategoryId,
          nombre: 'Categoría de prueba',
          descripcion: 'Descripción de prueba',
        }),
      ]),
    );
  });

  it('/api/categorias/:id (GET) - Obtener categoría específica', async () => {
    const response = await request(app.getHttpServer()).get(`/api/categorias/${createdCategoryId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', createdCategoryId);
    expect(response.body).toHaveProperty('nombre', 'Categoría de prueba');
  });

  it('/api/categorias/:id (PUT) - Actualizar categoría', async () => {
    const payload = { nombre: 'Categoría actualizada', descripcion: 'Descripción actualizada' };

    const response = await request(app.getHttpServer())
      .put(`/api/categorias/${createdCategoryId}`)
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(payload);
  });

  it('/api/categorias/:id (DELETE) - Eliminar categoría', async () => {
    const response = await request(app.getHttpServer()).delete(`/api/categorias/${createdCategoryId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Categoría eliminada exitosamente');

    // Verifica que la categoría ya no exista
    const getResponse = await request(app.getHttpServer()).get(`/api/categorias/${createdCategoryId}`);
    expect(getResponse.status).toBe(404); // La categoría debería no existir
  });
});
