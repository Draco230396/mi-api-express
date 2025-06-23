// sql/postgres/cita.sql.js
module.exports = {
  INSERT: `INSERT INTO citas (id_cita, id_persona, fecha_hora, motivo) VALUES ($1, $2, $3, $4)`,
  SELECT_ALL: `SELECT * FROM citas`,
  SELECT_BY_ID: `SELECT * FROM citas WHERE id_cita = $1`,
  SELECT_NEXT_24H: `
    SELECT * FROM citas 
    WHERE fecha_hora BETWEEN NOW() AND NOW() + INTERVAL '1 day'
  `,
  UPDATE: `UPDATE citas SET id_persona = $2, fecha_hora = $3, motivo = $4 WHERE id_cita = $1`,
  DELETE: `DELETE FROM citas WHERE id_cita = $1`
};

// sql/postgres/aviso.sql.js
module.exports = {
  INSERT: `INSERT INTO avisos (id_aviso, id_persona, id_cita, mensaje, fecha_aviso) VALUES ($1, $2, $3, $4, $5)`,
  SELECT_ALL: `SELECT * FROM avisos`,
  SELECT_BY_ID: `SELECT * FROM avisos WHERE id_aviso = $1`,
  DELETE: `DELETE FROM avisos WHERE id_aviso = $1`
};
