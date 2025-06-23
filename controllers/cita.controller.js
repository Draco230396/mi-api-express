const db = require('../config/db');
const queries = require(`../sql/${process.env.DB_CLIENT}/cita.sql.js`);

const generarId = () => Math.floor(Math.random() * 1000000);

exports.obtenerCitas = async (req, res) => {
  try {
    const result = await db.query(queries.SELECT_ALL);
    res.json(result.rows || result.rowsAffected || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerCitaPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.query(queries.SELECT_BY_ID, [id]);
    const cita = result.rows && result.rows.length > 0 ? result.rows[0] : null;
    if (!cita) return res.status(404).json({ message: 'Cita no encontrada' });
    res.json(cita);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.crearCita = async (req, res) => {
  try {
    const { personaId, fechaHora, motivo } = req.body;
    const id = generarId();
    await db.query(queries.INSERT, [id, personaId, new Date(fechaHora), motivo]);
    res.status(201).json({ message: 'Cita creada', id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarCita = async (req, res) => {
  try {
    const id = req.params.id;
    const { personaId, fechaHora, motivo } = req.body;
    await db.query(queries.UPDATE, [id, personaId, new Date(fechaHora), motivo]);
    res.json({ message: 'Cita actualizada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarCita = async (req, res) => {
  try {
    const id = req.params.id;
    await db.query(queries.DELETE, [id]);
    res.json({ message: 'Cita eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
