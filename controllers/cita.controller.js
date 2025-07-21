const Database = require('../config/db');
const db = Database.getInstance();
const queries = require(`../sql/${process.env.DB_CLIENT}/cita.sql.js`);
const Cita = require('../models/cita.model');

const generarId = () => Math.floor(Math.random() * 1000000);

// Función para convertir hora en formato AM/PM a 24 horas (HH:mm:ss)
function convertirHoraAmPmA24h(horaAmPm) {
  if (!horaAmPm) return null;
  const [time, modifier] = horaAmPm.trim().split(' ');
  let [hours, minutes] = time.split(':');
  hours = parseInt(hours, 10);
  if (modifier.toUpperCase() === 'PM' && hours < 12) {
    hours += 12;
  }
  if (modifier.toUpperCase() === 'AM' && hours === 12) {
    hours = 0;
  }
  return `${String(hours).padStart(2, '0')}:${minutes}:00`;
}

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
// Obtener citas por ID_PERSONA
exports.obtenerCitaPorIdPersona = async (req, res) => {
  try {
    const id_persona = parseInt(req.params.id_persona, 10); // Convertir a entero
    if (isNaN(id_persona)) {
      return res.status(400).json({ message: 'ID persona inválido' });
    }

    const result = await db.query(queries.SELECT_BY_ID_PERSONA, [id_persona]);
    const rows = result.rows || result;

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron citas para esa persona' });
    }

    res.json(rows); // Devuelve todas las citas encontradas para esa persona
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Crear cita
exports.crearCita = async (req, res) => {
  try {
    const {
      id_persona,
      titulo,
      fecha,
      hora_inicio,
      hora_final,
      nombre_cliente,
      numero_cliente,
      motivo
    } = req.body;

    const id = generarId();

    const horaInicio24h = convertirHoraAmPmA24h(hora_inicio);
    const horaFinal24h = convertirHoraAmPmA24h(hora_final);

    await db.query(queries.INSERT, [
      id,
      id_persona,
      titulo,
      fecha,
      horaInicio24h,
      horaFinal24h,
      nombre_cliente,
      numero_cliente,
      motivo
    ]);

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
    const {
      id_persona,
      titulo,
      fecha,
      hora_inicio,
      hora_final,
      nombre_cliente,
      numero_cliente,
      motivo
    } = req.body;

    const horaInicio24h = convertirHoraAmPmA24h(hora_inicio);
    const horaFinal24h = convertirHoraAmPmA24h(hora_final);

    await db.query(queries.UPDATE, [
      id,
      id_persona,
      titulo,
      fecha,
      horaInicio24h,
      horaFinal24h,
      nombre_cliente,
      numero_cliente,
      motivo
    ]);

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
