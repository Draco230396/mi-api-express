require('dotenv').config();
const oracledb = require('oracledb');
const { Pool } = require('pg');

class Database {
  constructor() {
    this.pool = null;
    this.dbClient = process.env.DB_CLIENT?.toLowerCase();
  }

  static instance;

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect() {
    if (this.pool) return this.pool;

    console.log('🔌 DB_CLIENT seleccionado:', this.dbClient);

    if (this.dbClient === 'oracle') {
      try {
        this.pool = await oracledb.createPool({
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          connectString: process.env.DB_CONNECTION_STRING,
          poolMin: 1,
          poolMax: 10,
          poolIncrement: 1
        });
        console.log('✅ Pool de Oracle creado');
      } catch (err) {
        console.error('❌ Error al crear el pool Oracle:', err.message);
        throw err;
      }
    } else if (this.dbClient === 'postgres') {
      try {
        this.pool = new Pool({
          user: process.env.DB_USER,
          host: process.env.DB_HOST,
          database: process.env.DB_DATABASE,
          password: process.env.DB_PASSWORD,
          port: process.env.DB_PORT
        });
        console.log('✅ Conectado a PostgreSQL');
      } catch (err) {
        console.error('❌ Error al conectar a PostgreSQL:', err.message);
        throw err;
      }
    } else {
      throw new Error('⚠️ DB_CLIENT no definido o no soportado');
    }

    return this.pool;
  }

  async query(sql, params = []) {
    const pool = await this.connect();

    if (this.dbClient === 'oracle') {
      let connection;
      try {
        connection = await pool.getConnection(); // obtiene una conexión del pool
        const result = await connection.execute(sql, params, {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
          autoCommit: true
        });
        return result;
      } catch (err) {
        console.error('❌ Error al ejecutar query Oracle:', err.message);
        throw err;
      } finally {
        if (connection) {
          try {
            await connection.close(); // libera la conexión al pool
          } catch (closeErr) {
            console.error('⚠️ Error al cerrar conexión Oracle:', closeErr.message);
          }
        }
      }
    } else if (this.dbClient === 'postgres') {
      console.log('⚙️ Ejecutando en PostgreSQL');
      return pool.query(sql, params);
    } else {
      throw new Error('⚠️ Cliente de base de datos no válido para ejecutar query');
    }
  }
}

module.exports = Database;
