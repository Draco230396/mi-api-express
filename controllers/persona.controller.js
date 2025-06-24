const Persona = require('../models/persona.model');
const db = require('../config/db');
const queries = require(`../sql/${process.env.DB_CLIENT}/persona.sql.js`);

const generarId = () => Math.floor(Math.random() * 1000000); // genera ID simple, reemplazar con secuencia en BD real

exports.obtenerPersonas = async (req, res) => {
  try {
    const result = await db.query(queries.SELECT_ALL);
    const personas = (result.rows || result).map(Persona);
    res.json(personas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerPersonaPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.query(queries.SELECT_BY_ID, [id]);

    const rows = result.rows || result;
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }

    res.json(Persona(rows[0]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.crearPersona = async (req, res) => {
  try {
    const { nombre, email, telefono } = req.body;
    const id = generarId();

    await db.query(queries.INSERT, [id, nombre, email, telefono]);

    const persona = Persona({ id_persona: id, nombre, email, telefono });
    res.status(201).json(persona);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarPersona = async (req, res) => {
  try {
    const id = req.params.id;
    const { nombre, email, telefono } = req.body;

    // Actualiza la persona
    await db.query(queries.UPDATE, [id, nombre, email, telefono]);

    // Consulta para retornar la nueva persona actualizada
    const result = await db.query(queries.SELECT_BY_ID, [id]);
    const rows = result.rows || result;

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Persona no encontrada después de actualizar' });
    }

    res.json({
      message: 'Persona actualizada',
      persona: Persona(rows[0])
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarPersona = async (req, res) => {
  try {
    const id = req.params.id;

    // Consulta antes de eliminar para mostrar qué se borró
    const result = await db.query(queries.SELECT_BY_ID, [id]);
    const rows = result.rows || result;

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }

    const personaEliminada = Persona(rows[0]);

    // Eliminar
    await db.query(queries.DELETE, [id]);

    res.json({
      message: 'Persona eliminada',
      persona: personaEliminada
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};