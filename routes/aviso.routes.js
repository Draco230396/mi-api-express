const express = require('express');
const router = express.Router();
const db = require('../config/db');
const avisoQueries = require(`../sql/${process.env.DB_CLIENT}/aviso.sql`);
const { generarAvisos } = require('../utils/notificador');

// Obtener todos los avisos
router.get('/', async (req, res) => {
  try {
    const result = await db.query(avisoQueries.SELECT_ALL);
    res.json(result.rows || result);
  } catch (err) {
    console.error('Error al consultar avisos:', err);
    res.status(500).json({ error: err.message, details: err });
  }
});
// Obtener avisos por persona
router.get('/persona/:id', async (req, res) => {
  const personaId = req.params.id;

  try {
    const result = await db.query(avisoQueries.SELECT_BY_PERSONA, [personaId]);
    res.json(result.rows || result);
  } catch (err) {
    console.error('Error al consultar avisos por persona:', err);
    res.status(500).json({ error: err.message });
  }
});
// Generar avisos manualmente
router.post('/generar', async (req, res) => {
  try {
    await generarAvisos();
    res.json({ message: 'Avisos generados manualmente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
