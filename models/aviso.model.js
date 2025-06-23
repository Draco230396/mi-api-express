function Aviso({ id_aviso, id_persona, id_cita, mensaje, fecha_aviso }) {
  return {
    id: id_aviso,
    personaId: id_persona,
    citaId: id_cita,
    mensaje,
    fechaAviso: fecha_aviso
  };
}

module.exports = Aviso;
