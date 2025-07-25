module.exports = {
  INSERT: `
    INSERT INTO PERSONAS (ID_PERSONA, NOMBRE, EMAIL, TELEFONO)
    VALUES ($1, $2, $3, $4)
  `,
  SELECT_ALL: `
    SELECT * FROM PERSONAS
  `,
  SELECT_BY_ID: `
    SELECT * FROM PERSONAS WHERE ID_PERSONA = $1
  `,
  UPDATE: `
    UPDATE PERSONAS
    SET NOMBRE = $1, EMAIL = $2, TELEFONO = $3
    WHERE ID_PERSONA = $4
  `,
  DELETE: `
    DELETE FROM PERSONAS WHERE ID_PERSONA = $1
  `
};

