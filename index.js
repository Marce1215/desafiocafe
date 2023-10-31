const express = require('express');
const app = express();
const { Pool } = require('pg');


const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'marce1215',
    database: 'cafes',
    port: 5432, // El puerto predeterminado de PostgreSQL es 5432.
    allowExitOnIdle: true
})

const port = 3500;
app.listen(port, () => {
  console.log(`La API REST está escuchando en el puerto ${port}`);
});

app.use(express.json());

// Ruta GET para obtener todos los cafés
app.get('/cafes', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM cafe');
    const cafes = result.rows;
    client.release();
    
    if (cafes.length > 0) {
      res.status(200).json(cafes);
    } else {
      res.status(404).send('No hay datos de cafés');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta DELETE para eliminar un café por su ID
app.delete('/cafes/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (!id || id <= 0) {
    return res.status(400).send('ID de café no válido');
  }

  try {
    const client = await pool.connect();
    const result = await client.query('DELETE FROM cafe WHERE id = $1', [id]);
    const rowCount = result.rowCount;
    client.release();

    if (rowCount > 0) {
      res.status(200).send('Café eliminado');
    } else {
      res.status(404).send('Café no encontrado');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta POST para crear un nuevo café
app.post('/cafes', async (req, res) => {
  const { nombre, direccion } = req.body;
  if (!nombre || !direccion) {
    return res.status(400).send('Faltan datos necesarios');
  }

  try {
    const client = await pool.connect();
    const result = await client.query('INSERT INTO cafe (nombre, direccion) VALUES ($1, $2) RETURNING id', [nombre, direccion]);
    const newId = result.rows[0].id;
    client.release();

    res.status(201).send('Café creado con ID ' + newId);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta PUT para actualizar un café por su ID
app.put('/cafes/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (!id || id <= 0) {
    return res.status(400).send('ID de café no válido');
  }

  const { nombre, direccion } = req.body;
  if (!nombre || !direccion) {
    return res.status(400).send('Faltan datos necesarios');
  }

  try {
    const client = await pool.connect();
    const result = await client.query('UPDATE cafe SET nombre = $1, direccion = $2 WHERE id = $3', [nombre, direccion, id]);
    const rowCount = result.rowCount;
    client.release();

    if (rowCount > 0) {
      res.status(200).send('Café actualizado');
    } else {
      res.status(404).send('Café no encontrado');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
});

