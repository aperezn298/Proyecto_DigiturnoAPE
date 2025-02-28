export const validarModulo = (modulo: number): string | null => {
  if (/^(?:[0-9]{1,3})$/.test(modulo.toString())) {
    return null;
  } else {
    return "El módulo es inválido, debe ser un número de 1 a 3 dígitos";
  }
};
export const validarObservacion = (observacion: string): string | null => {
  if (/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,-]{1,255}$/.test(observacion) || observacion == "") {
    return null;
  } else {
    return "La observación debe ser alfanumérica; máximo 250 caracteres";
  }
};
