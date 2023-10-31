const request = require('supertest');
const app = require('./tu-aplicacion-express'); 

describe('Pruebas de la API REST', () => {
  it('GET /cafes debe devolver 200 y un arreglo de cafés', async () => {
    const response = await request(app).get('/cafes');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('POST /cafes debe crear un nuevo café y devolver 201', async () => {
    const nuevoCafe = { nombre: 'Café Nuevo', direccion: 'Dirección Nueva' };
    const response = await request(app)
      .post('/cafes')
      .send(nuevoCafe);
    expect(response.status).toBe(201);
  });

  it('PUT /cafes/:id debe actualizar un café existente y devolver 200', async () => {
    const cafeActualizado = { nombre: 'Café Actualizado', direccion: 'Nueva Dirección' };
    const response = await request(app)
      .put('/cafes/1') 
      .send(cafeActualizado);
    expect(response.status).toBe(200);
  });

  it('DELETE /cafes/:id debe eliminar un café existente y devolver 200', async () => {
    const response = await request(app)
      .delete('/cafes/1') 
    expect(response.status).toBe(200);
  });
});