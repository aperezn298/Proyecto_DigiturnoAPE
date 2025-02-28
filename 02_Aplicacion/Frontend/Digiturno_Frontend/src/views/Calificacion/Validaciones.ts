export const validarObservacion = (observacion: string): string | null => {
    if (/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,-]{1,100}$/.test(observacion) || observacion == "") {
      return null;
    } else {
      return "La observación debe ser alfanumérica; máximo 100 caracteres";
    }
  };