// config/db.js
require('dotenv').config();
const oracledb = require('oracledb');
const { Pool } = require('pg');

class Database {
  constructor() {
    this.pool = null;
    this.dbClient = process.env.DB_CLIENT;
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

    if (this.dbClient === 'oracle') {
      this.pool = await oracledb.getConnection({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectString: process.env.DB_CONNECTION_STRING
      });
      console.log('✅ Conectado a Oracle');
    } else if (this.dbClient === 'postgres') {
      this.pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
      });
      console.log('✅ Conectado a PostgreSQL');
    } else {
      throw new Error('Base de datos no soportada');
    }

    return this.pool;
  }

  async query(sql, params = []) {
    const pool = await this.connect();

    if (this.dbClient === 'oracle') {
      return pool.execute(sql, params, {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        autoCommit: true
      });
    } else if (this.dbClient === 'postgres') {
      return pool.query(sql, params);
    }
  }
}

module.exports = Database; // <--- exporta la clase, no la instancia
