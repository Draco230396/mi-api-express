const db = require('../config/db');
const queries = require(`../sql/${process.env.DB_CLIENT}/aviso.sql.js`);

const generarId = () => Math.floor(Math.random() * 1000000);

exports.obtenerAvisos = async (req, res) => {
  try {
    const result = await db.query(queries.SELECT_ALL);
    res.json(result.rows || result.rowsAffected || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerAvisoPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.query(queries.SELECT_BY_ID, [id]);
    const aviso = result.rows && result.rows.length > 0 ? result.rows[0] : null;
    if (!aviso) return res.status(404).json({ message: 'Aviso no encontrado' });
    res.json(aviso);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.crearAviso = async (req, res) => {
  try {
    const { personaId, citaId, mensaje, fechaAviso } = req.body;
    const id = generarId();
    await db.query(queries.INSERT, [id, personaId, citaId, mensaje, new Date(fechaAviso)]);
    res.status(201).json({ message: 'Aviso creado', id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarAviso = async (req, res) => {
  try {
    const id = req.params.id;
    await db.query(queries.DELETE, [id]);
    res.json({ message: 'Aviso eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
