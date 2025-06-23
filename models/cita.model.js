function Cita({ id_cita, id_persona, fecha_hora, motivo }) {
  return {
    id: id_cita,
    personaId: id_persona,
    fechaHora: fecha_hora,
    motivo
  };
}

module.exports = Cita;
