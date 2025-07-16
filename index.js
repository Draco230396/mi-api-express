require('dotenv').config();
console.log('🧪 DB_CLIENT desde index env:', process.env.DB_CLIENT);
const express = require('express');
const cors = require('cors'); // 👈 importar cors
const debug = require('debug')('app:server');
const Database = require('./config/db'); // Singleton de conexión
const db = Database.getInstance(); // Obtenemos la instancia del Singleton
const { generarAvisos } = require('./utils/notificador');

const app = express();

// Middleware para parsear JSON
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // 👈 usar cors aquí
app.use(express.json());
// Rutas
app.use('/api/personas', require('./routes/persona.routes'));
app.use('/api/citas', require('./routes/cita.routes'));
app.use('/api/avisos', require('./routes/aviso.routes'));
app.use('/api/auth', require('./routes/auth.routes'));


// Función para iniciar el servidor y conectar a la BD
async function startServer() {
  try {
    await db.connect(); // Espera la conexión correctamente
    app.listen(3001, () => {
      console.log('🚀 Servidor iniciado en http://localhost:3001');
    });

    // Ejecutar la función generarAvisos cada 30 minutos
    const INTERVALO_MINUTOS = 1;
    setInterval(() => {
      generarAvisos(); // 🔔 Ejecutar aviso automático
    }, INTERVALO_MINUTOS * 60 * 1000);

  } catch (err) {
    console.error('❌ Error al conectar a la base de datos:', err.message);
  }
}

// Iniciar servidor
startServer();
