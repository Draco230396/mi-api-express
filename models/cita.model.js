function Cita(row){
  return {
    id: row.ID_CITA || row.id_cita,
    personaId: row.PERSONAID ||  row.id_persona,
    fechaHora: row.FECAHORA || row.fecha_hora,
    motivo: row.MOTIVO || row.motivo
  };
}
module.exports = Cita;