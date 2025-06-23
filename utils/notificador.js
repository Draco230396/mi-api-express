const db = require('../config/db');
const citaQueries = require(`../sql/${process.env.DB_CLIENT}/cita.sql.js`);
const avisoQueries = require(`../sql/${process.env.DB_CLIENT}/aviso.sql.js`);

// 🔧 Utilidad para sumar tiempo
function sumarTiempo(fecha, cantidad, unidad) {
  const msPorUnidad = {
    horas: 1000 * 60 * 60,
    dias: 1000 * 60 * 60 * 24
  };
  return new Date(fecha.getTime() + cantidad * msPorUnidad[unidad]);
}

// 📣 Función principal para generar avisos
async function generarAvisos() {
  try {
    const ahora = new Date();

    const result = await db.query(citaQueries.SELECT_NEXT_24H);
    const citas = result.rows || [];

    for (const cita of citas) {
      const fechaCita = new Date(cita.FECHA_HORA || cita.fecha_hora);
      const personaId = cita.ID_PERSONA || cita.id_persona;
      const citaId = cita.ID_CITA || cita.id_cita;

      // 🔔 1 día antes
      const unDiaAntes = sumarTiempo(fechaCita, -1, 'dias');
      if (ahora >= unDiaAntes && ahora < fechaCita) {
        const mensaje = `📅 Recordatorio: Tu cita es mañana (${fechaCita.toLocaleString()})`;
        await crearAvisoSiNoExiste(personaId, citaId, mensaje);
      }

      // ⏰ 3 horas antes
      const tresHorasAntes = sumarTiempo(fechaCita, -3, 'horas');
      if (ahora >= tresHorasAntes && ahora < fechaCita) {
        const mensaje = `⏰ Recordatorio: Tu cita es en 3 horas (${fechaCita.toLocaleString()})`;
        await crearAvisoSiNoExiste(personaId, citaId, mensaje);
      }
    }

    console.log('✔️ Avisos procesados');
  } catch (err) {
    console.error('❌ Error generando avisos:', err);
  }
}

// ✅ Crear aviso si no existe
async function crearAvisoSiNoExiste(personaId, citaId, mensaje) {
  // 📌 Selección dinámica de query según motor de BD
  const avisoSelectQuery = process.env.DB_CLIENT === 'oracle' 
    ? avisoQueries.SELECT_BY_PERSONA_CITA_MENSAJE_ORACLE
    : avisoQueries.SELECT_BY_PERSONA_CITA_MENSAJE_POSTGRES;

  const avisosExistentes = await db.query(
    avisoSelectQuery,
    [personaId, citaId, mensaje]
  );

  const yaExiste = (avisosExistentes.rows && avisosExistentes.rows.length > 0)
                || (avisosExistentes.rowCount && avisosExistentes.rowCount > 0);

  if (!yaExiste) {
    const idAviso = Math.floor(Math.random() * 1000000);
    await db.query(avisoQueries.INSERT, [idAviso, personaId, citaId, mensaje, new Date()]);
    console.log(`✅ Aviso creado para persona ${personaId}: "${mensaje}"`);
  }
}

module.exports = { generarAvisos };
