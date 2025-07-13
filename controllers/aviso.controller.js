const Database = require('../config/db');
const db = Database.getInstance(); // ✅ ahora tienes la instancia real con .query()
const avisoQueries = require(`../sql/${process.env.DB_CLIENT}/aviso.sql`);
const { generarAvisos } = require('../utils/notificador');

// Obtener todos los avisos
exports.obtenerAvisos = async (req, res) => {
  try {
    const result = await db.query(avisoQueries.SELECT_ALL);
    res.json(result.rows || result);
  } catch (err) {
    console.error('Error al consultar avisos:', err);
    res.status(500).json({ error: err.message });
  }
};

// Obtener aviso por ID
exports.obtenerAvisoPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.query(avisoQueries.SELECT_BY_ID, [id]);
    const aviso = result.rows?.[0];
    if (!aviso) {
      return res.status(404).json({ message: 'Aviso no encontrado' });
    }
    res.json(aviso);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener avisos por persona
exports.obtenerAvisosPorPersona = async (req, res) => {
  try {
    const personaId = req.params.id;
    const result = await db.query(avisoQueries.SELECT_BY_PERSONA, [personaId]);
    res.json(result.rows || result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear un aviso manualmente
exports.crearAviso = async (req, res) => {
  try {
    const { id_aviso, id_persona, id_cita, mensaje, fecha_aviso } = req.body;
    await db.query(avisoQueries.INSERT, [
      id_aviso,
      id_persona,
      id_cita,
      mensaje,
      new Date(fecha_aviso)
    ]);
    res.status(201).json({ message: 'Aviso creado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar un aviso
exports.actualizarAviso = async (req, res) => {
  try {
    const id = req.params.id;
    const { id_persona, id_cita, mensaje, fecha_aviso } = req.body;
    await db.query(avisoQueries.UPDATE, [
      id_persona,
      id_cita,
      mensaje,
      new Date(fecha_aviso),
      id
    ]);
    res.json({ message: 'Aviso actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar un aviso
exports.eliminarAviso = async (req, res) => {
  try {
    const id = req.params.id;
    await db.query(avisoQueries.DELETE, [id]);
    res.json({ message: 'Aviso eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Generar avisos automáticamente (usando notificador.js)
exports.generarAvisosManualmente = async (req, res) => {
  try {
    await generarAvisos();
    res.json({ message: 'Avisos generados manualmente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
