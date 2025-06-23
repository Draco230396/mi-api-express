require('dotenv').config();
const oracledb = require('oracledb');
const { Pool } = require('pg');

const DB_CLIENT = process.env.DB_CLIENT;
let pool;

async function connect() {
  if (DB_CLIENT === 'oracle') {
    // ✅ Conectar a Oracle con una sola conexión por ahora
    pool = await oracledb.getConnection({
      user: process.env.DB_USER || 'C##DRACO',
      password: process.env.DB_PASSWORD || 'N4tur4l3s*_#',
      connectString: process.env.DB_CONNECTION_STRING || 'localhost:1521/xe'
    });
    console.log('✅ Conectado a Oracle exitosamente');
  } else if (DB_CLIENT === 'postgres') {
    // ✅ Crear pool de PostgreSQL
    pool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_DATABASE || 'mi_bd',
      password: process.env.DB_PASSWORD || 'mi_clave',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432
    });
    console.log('✅ Conectado a PostgreSQL exitosamente');
  } else {
    throw new Error('Base de datos no soportada');
  }
}

async function query(sql, params = []) {
  if (DB_CLIENT === 'oracle') {
    return pool.execute(sql, params, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      autoCommit: true // ✅ IMPORTANTE para Oracle
    });
  } else if (DB_CLIENT === 'postgres') {
    return pool.query(sql, params); // PostgreSQL hace commit automático
  } else {
    throw new Error('Cliente de base de datos no soportado');
  }
}

module.exports = { connect, query };
