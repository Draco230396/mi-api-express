const db = require('../config/db');
const queries = require(`../sql/${process.env.DB_CLIENT}/persona.sql.js`);

const generarId = () => Math.floor(Math.random() * 1000000); // genera ID simple, reemplazar con secuencia en BD real

exports.obtenerPersonas = async (req, res) => {
  try {
    const result = await db.query(queries.SELECT_ALL);
    res.json(result.rows || result.rowsAffected || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerPersonaPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.query(queries.SELECT_BY_ID, [id]);
    const persona = result.rows && result.rows.length > 0 ? result.rows[0] : null;
    if (!persona) {
      return res.status(404).json({ message: "Persona no encontrada" });
    }
    res.json(persona);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.crearPersona = async (req, res) => {
  try {
    const { nombre, email, telefono } = req.body;
    const id = generarId(); // En producción usar secuencia/autoincremental en BD
    await db.query(queries.INSERT, [id, nombre, email, telefono]);
    res.status(201).json({ message: 'Persona creada', id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarPersona = async (req, res) => {
  try {
    const id = req.params.id;
    const { nombre, email, telefono } = req.body;
    await db.query(queries.UPDATE, [id, nombre, email, telefono]);
    res.json({ message: 'Persona actualizada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarPersona = async (req, res) => {
  try {
    const id = req.params.id;
    await db.query(queries.DELETE, [id]);
    res.json({ message: 'Persona eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
