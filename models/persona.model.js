function Persona({ id_persona, nombre, email, telefono }) {
  return {
    id: id_persona,
    nombre,
    email,
    telefono
  };
}

module.exports = Persona;