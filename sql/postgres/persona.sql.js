// sql/postgres/persona.sql.js
module.exports = {
  INSERT: `INSERT INTO personas (id_persona, nombre, email, telefono) VALUES ($1, $2, $3, $4)`,
  SELECT_ALL: `SELECT * FROM personas`,
  SELECT_BY_ID: `SELECT * FROM personas WHERE id_persona = $1`,
  UPDATE: `UPDATE personas SET nombre = $2, email = $3, telefono = $4 WHERE id_persona = $1`,
  DELETE: `DELETE FROM personas WHERE id_persona = $1`
};
