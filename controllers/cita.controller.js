const db = require('../config/db');
const queries = require(`../sql/${process.env.DB_CLIENT}/cita.sql.js`);
const Cita = require('../models/cita.model');

const generarId = () => Math.floor(Math.random() * 1000000);

// Obtener todas las citas
exports.obtenerCitas = async (req, res) => {
  try {
    const result = await db.query(queries.SELECT_ALL);
    const citas = (result.rows || result).map(Cita);
    res.json(citas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener cita por ID
exports.obtenerCitaPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.query(queries.SELECT_BY_ID, [id]);
    const rows = result.rows || result;
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }
    res.json(Cita(rows[0]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear cita
exports.crearCita = async (req, res) => {
  try {
    const { personaId, fechaHora, motivo } = req.body;
    const id = generarId();
    await db.query(queries.INSERT, [id, personaId, new Date(fechaHora), motivo]);

    // Consultar la cita recién insertada
    const result = await db.query(queries.SELECT_BY_ID, [id]);
    const rows = result.rows || result;

    res.status(201).json({
      message: 'Cita creada',
      cita: Cita(rows[0])
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar cita
exports.actualizarCita = async (req, res) => {
  try {
    const id = req.params.id;
    const { personaId, fechaHora, motivo } = req.body;

    await db.query(queries.UPDATE, [id, personaId, new Date(fechaHora), motivo]);

    // Consultar la cita actualizada
    const result = await db.query(queries.SELECT_BY_ID, [id]);
    const rows = result.rows || result;

    res.json({
      message: 'Cita actualizada',
      cita: Cita(rows[0])
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar cita
exports.eliminarCita = async (req, res) => {
  try {
    const id = req.params.id;

    // Consultar antes de eliminar
    const result = await db.query(queries.SELECT_BY_ID, [id]);
    const rows = result.rows || result;

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    const citaEliminada = Cita(rows[0]);

    await db.query(queries.DELETE, [id]);

    res.json({
      message: 'Cita eliminada',
      cita: citaEliminada
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
